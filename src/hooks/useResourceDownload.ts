import { useState, useEffect } from 'react';
import { Resource, ResourceCategory, DownloadStats, RedirectSettings } from '../types/resourceDownload';
import { ResourceService } from '../services/resourceService';
import { FileStorageService } from '../services/fileStorageService';
import { DownloadStatsService } from '../services/downloadStatsService';
import { RedirectSettingsService } from '../services/redirectSettingsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const useResourceDownload = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [downloadStats, setDownloadStats] = useState<DownloadStats>({
    totalDownloads: 0,
    todayDownloads: 0,
    conversionRate: 0,
    popularResource: ''
  });
  const [redirectSettings, setRedirectSettings] = useState<RedirectSettings>({
    redirectUrl: 'https://remila.jp/',
    redirectDelay: 1000,
    showCompletionMessage: true,
    enableAutoRedirect: true
  });

  // 資料データを取得
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await ResourceService.fetchResources();
      
      if (result.error) {
        setError(result.error);
      } else {
        setResources(result.data);
      }
    } catch (err) {
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // カテゴリデータを取得
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('カテゴリデータ取得エラー:', error);
        return;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('カテゴリデータ取得処理エラー:', err);
    }
  };

  // ダウンロード統計を取得
  const fetchDownloadStats = async () => {
    try {
      const stats = await DownloadStatsService.fetchDownloadStats();
      setDownloadStats(stats);
    } catch (err) {
      console.error('ダウンロード統計取得エラー:', err);
    }
  };

  // 遷移先設定を取得
  const fetchRedirectSettings = async () => {
    try {
      const settings = await RedirectSettingsService.fetchRedirectSettings();
      setRedirectSettings(settings);
    } catch (err) {
      console.error('遷移先設定取得エラー:', err);
    }
  };

  // 資料を作成
  const createResource = async (resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count' | 'category'>): Promise<{ success: boolean; error?: string; data?: Resource }> => {
    const result = await ResourceService.createResource(resourceData);
    
    if (result.success && result.data) {
      setResources(prev => [...prev, result.data!]);
    }
    
    return result;
  };

  // 資料を更新
  const updateResource = async (id: string, resourceData: Partial<Resource>): Promise<{ success: boolean; error?: string }> => {
    const result = await ResourceService.updateResource(id, resourceData);
    
    if (result.success) {
      setResources(prev => prev.map(resource => 
        resource.id === id ? { ...resource, ...resourceData } : resource
      ));
    }
    
    return result;
  };

  // 資料を削除
  const deleteResource = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const result = await ResourceService.deleteResource(id);
    
    if (result.success) {
      setResources(prev => prev.filter(resource => resource.id !== id));
    }
    
    return result;
  };

  // ダウンロード記録を追加
  const recordDownload = async (resourceId: string): Promise<{ success: boolean; error?: string }> => {
    const result = await DownloadStatsService.recordDownload(resourceId);
    
    // ダウンロード数を増加
    if (result.success) {
      const resource = resources.find(r => r.id === resourceId);
      if (resource) {
        await DownloadStatsService.incrementDownloadCount(resourceId, resource.download_count);
      }
    }
    
    return result;
  };

  // ファイルをアップロード
  const uploadFile = (file: File, onProgress?: (progress: number) => void) => {
    return FileStorageService.uploadFile(file, onProgress);
  };

  // ファイルを削除
  const deleteFile = (fileUrl: string) => {
    return FileStorageService.deleteFile(fileUrl);
  };

  // 遷移先設定を保存
  const saveRedirectSettings = async (settings: RedirectSettings): Promise<{ success: boolean; error?: string }> => {
    const result = await RedirectSettingsService.saveRedirectSettings(settings);
    
    if (result.success) {
      setRedirectSettings(settings);
    }
    
    return result;
  };

  // 初期データ取得
  useEffect(() => {
    fetchResources();
    fetchCategories();
    fetchDownloadStats();
    fetchRedirectSettings();

    // 5分ごとに統計を更新
    const interval = setInterval(fetchDownloadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    resources,
    categories,
    downloadStats,
    redirectSettings,
    loading,
    error,
    setRedirectSettings,
    saveRedirectSettings,
    fetchResources,
    fetchDownloadStats,
    createResource,
    updateResource,
    deleteResource,
    recordDownload,
    uploadFile,
    deleteFile
  };
};
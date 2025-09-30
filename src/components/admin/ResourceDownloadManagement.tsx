import React, { useState } from 'react';
import { Eye, Download, TrendingUp } from 'lucide-react';
import { useResourceDownload } from '../../hooks/useResourceDownload';
import { useResourceForm } from '../../hooks/useResourceForm';
import { TabType } from '../../types/resourceDownload';
import TabNavigation from './resourceDownload/TabNavigation';
import OverviewTab from './resourceDownload/OverviewTab';
import ResourcesTab from './resourceDownload/ResourcesTab';
import RedirectTab from './resourceDownload/RedirectTab';
import AnalyticsTab from './resourceDownload/AnalyticsTab';
import UploadProgressDialog from './resourceDownload/UploadProgressDialog';

const ResourceDownloadManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [isIconUploading, setIsIconUploading] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string>('');

  // カスタムフックを使用
  const {
    resources,
    downloadStats,
    redirectSettings,
    setRedirectSettings,
    saveRedirectSettings,
    updateResource,
    createResource,
    deleteResource,
    uploadFile,
    deleteFile
  } = useResourceDownload();

  // 編集フォーム用のカスタムフック
  const {
    formData: editForm,
    handleInputChange: handleEditInputChange,
    handleFileSelect: handleEditFileSelect,
    handleIconSelect: handleEditIconSelect,
    handleFileDelete: handleEditFileDelete,
    handleIconDelete: handleEditIconDelete,
    resetForm: resetEditForm
  } = useResourceForm();

  // 追加フォーム用のカスタムフック
  const {
    formData: addForm,
    handleInputChange: handleAddInputChange,
    handleFileSelect: handleAddFileSelect,
    handleIconSelect: handleAddIconSelect,
    handleFileDelete: handleAddFileDelete,
    handleIconDelete: handleAddIconDelete,
    resetForm: resetAddForm
  } = useResourceForm({
    title: '新しい資料',
    description: '資料の説明を入力してください'
  });

  // アイコンをSupabaseにアップロード（編集用）
  const handleEditIconUpload = async () => {
    if (!editForm.iconFile) return;

    try {
      setIsIconUploading(true);
      setIconUploadError('');

      console.log('アイコンアップロード開始:', editForm.iconFile.name);

      // 古いアイコンがある場合は削除
      if (editForm.iconUrl && editForm.iconUrl.includes('supabase')) {
        const oldPath = extractPathFromUrl(editForm.iconUrl, 'resource-files');
        if (oldPath) {
          await deleteFile(editForm.iconUrl);
        }
      }

      // ユニークなファイル名を生成
      const fileExtension = editForm.iconFile.name.split('.').pop();
      const fileName = `icon-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `resource-icons/${fileName}`;

      // Supabaseにアップロード
      const { uploadImage } = await import('../../lib/supabase');
      const { url, error } = await uploadImage(editForm.iconFile, 'resource-files', filePath);
      
      if (error) {
        setIconUploadError(`アップロードに失敗しました: ${error}`);
        return;
      }

      if (!url) {
        setIconUploadError('アップロードに失敗しました: URLが取得できませんでした');
        return;
      }

      // フォームのアイコンURLを更新
      handleEditInputChange('iconUrl', url);
      handleEditInputChange('iconFile', null);
      
      // ファイル入力をリセット
      const fileInput = document.getElementById('edit-icon-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setIconUploadError('');
      console.log('アイコンアップロード完了:', url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setIconUploadError(`アップロードに失敗しました: ${errorMessage}`);
    } finally {
      setIsIconUploading(false);
    }
  };

  // アイコンをSupabaseにアップロード（追加用）
  const handleAddIconUpload = async () => {
    if (!addForm.iconFile) return;

    try {
      setIsIconUploading(true);
      setIconUploadError('');

      console.log('アイコンアップロード開始:', addForm.iconFile.name);

      // ユニークなファイル名を生成
      const fileExtension = addForm.iconFile.name.split('.').pop();
      const fileName = `icon-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `resource-icons/${fileName}`;

      // Supabaseにアップロード
      const { uploadImage } = await import('../../lib/supabase');
      const { url, error } = await uploadImage(addForm.iconFile, 'resource-files', filePath);
      
      if (error) {
        setIconUploadError(`アップロードに失敗しました: ${error}`);
        return;
      }

      if (!url) {
        setIconUploadError('アップロードに失敗しました: URLが取得できませんでした');
        return;
      }

      // フォームのアイコンURLを更新
      handleAddInputChange('iconUrl', url);
      handleAddInputChange('iconFile', null);
      
      // ファイル入力をリセット
      const fileInput = document.getElementById('add-icon-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setIconUploadError('');
      console.log('アイコンアップロード完了:', url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setIconUploadError(`アップロードに失敗しました: ${errorMessage}`);
    } finally {
      setIsIconUploading(false);
    }
  };

  // URLからファイルパスを抽出するヘルパー関数
  const extractPathFromUrl = (url: string, bucket: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.indexOf(bucket);
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      
      return null;
    } catch {
      return null;
    }
  };

  // ファイルサイズをフォーマット
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 編集開始
  const handleEdit = (resource: any) => {
    setEditingResourceId(resource.id);
    handleEditInputChange('title', resource.title);
    handleEditInputChange('description', resource.description);
    handleEditInputChange('uploadedFileUrl', resource.file_url || '');
    handleEditInputChange('iconUrl', resource.icon_url || '');
    handleEditInputChange('is_published', resource.is_published);
  };

  // 編集保存
  const handleSave = () => {
    if (editingResourceId) {
      // ファイルアップロードが不要な場合
      updateResource(editingResourceId, {
        title: editForm.title,
        description: editForm.description,
        icon_url: editForm.iconUrl,
        is_published: editForm.is_published
      });
      setEditingResourceId(null);
      resetEditForm();
      alert('資料情報を保存しました');
    }
  };

  // 編集キャンセル
  const handleCancel = () => {
    setEditingResourceId(null);
    resetEditForm();
  };

  // 新規追加
  const handleAdd = () => {
    setShowAddForm(true);
  };

  // 新規追加保存
  const handleAddSave = async () => {
    try {
      if (!addForm.uploadedFile) {
        alert('ファイルを選択してください');
        return;
      }

      // アップロード開始
      setIsUploading(true);
      setUploadFileName(addForm.uploadedFile.name);
      setUploadProgress(0);

      // ファイルをアップロード
      const uploadResult = await uploadFile(addForm.uploadedFile, (progress) => {
        setUploadProgress(progress);
      });
      
      if (!uploadResult.success) {
        setIsUploading(false);
        alert(`ファイルアップロードに失敗しました: ${uploadResult.error}`);
        return;
      }

      // 資料を作成
      const createResult = await createResource({
        title: addForm.title,
        description: addForm.description,
        file_name: addForm.uploadedFile.name,
        file_size: addForm.uploadedFile.size,
        file_url: uploadResult.url!,
        file_type: addForm.uploadedFile.type,
        icon_url: addForm.iconUrl,
        category_id: addForm.category_id,
        is_published: addForm.is_published,
        display_order: resources.length + 1
      });

      if (createResult.success) {
        // 完了ダイアログを少し表示してから閉じる
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadFileName('');
        }, 1500);
        
        setShowAddForm(false);
        resetAddForm();
      } else {
        setIsUploading(false);
        alert(`資料作成に失敗しました: ${createResult.error}`);
      }
    } catch (err) {
      setIsUploading(false);
      alert(`追加処理でエラーが発生しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // 新規追加キャンセル
  const handleAddCancel = () => {
    setShowAddForm(false);
    resetAddForm();
  };

  // 削除
  const handleDelete = async (resourceId: string) => {
    if (confirm('この資料を削除しますか？')) {
      try {
        // 資料情報を取得してファイルURLを確認
        const resource = resources.find(r => r.id === resourceId);
        
        // ファイルを削除
        if (resource?.file_url) {
          await deleteFile(resource.file_url);
        }

        // 資料レコードを削除
        const deleteResult = await deleteResource(resourceId);
        
        if (deleteResult.success) {
          setEditingResourceId(null);
          alert('資料を削除しました');
        } else {
          alert(`削除に失敗しました: ${deleteResult.error}`);
        }
      } catch (err) {
        alert(`削除処理でエラーが発生しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  // 統計データを手動更新
  const handleRefreshStats = async () => {
    try {
      await fetchDownloadStats();
      alert('統計データを更新しました');
    } catch (err) {
      alert('統計データの更新に失敗しました');
    }
  };

  // ファイルバリデーション
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // サイズチェック（50MB制限）
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: 'ファイルサイズが50MBを超えています。' };
    }

    // ファイルタイプチェック
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: '対応していないファイル形式です。PDF、JPG、PNGのみアップロード可能です。' };
    }

    return { isValid: true };
  };

  // 編集フォームのファイル選択ハンドラ
  const handleEditFileSelectWithValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      handleEditFileSelect(event);
    }
  };

  // 追加フォームのファイル選択ハンドラ
  const handleAddFileSelectWithValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      handleAddFileSelect(event);
    }
  };

  // 遷移先設定保存
  const handleSaveRedirectSettings = async () => {
    const result = await saveRedirectSettings(redirectSettings);
    if (result.success) {
      alert('遷移先設定を保存しました');
    } else {
      alert(`設定の保存に失敗しました: ${result.error}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab downloadStats={downloadStats} resources={resources} />;
      case 'resources':
        return (
          <ResourcesTab
            resources={resources}
            editingResourceId={editingResourceId}
            showAddForm={showAddForm}
            editForm={editForm}
            addForm={addForm}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onAddSave={handleAddSave}
            onAddCancel={handleAddCancel}
            onInputChange={handleEditInputChange}
            onAddInputChange={handleAddInputChange}
            onFileSelect={handleEditFileSelect}
            onIconSelect={handleEditIconSelect}
            onAddFileSelect={handleAddFileSelect}
            onFileDelete={handleEditFileDelete}
            onIconDelete={handleEditIconDelete}
            onAddFileDelete={handleAddFileDelete}
            formatFileSize={formatFileSize}
            onEditIconUpload={handleEditIconUpload}
            onAddIconUpload={handleAddIconUpload}
            isIconUploading={isIconUploading}
            iconUploadError={iconUploadError}
          />
        );
      case 'redirect':
        return (
          <RedirectTab
            redirectSettings={redirectSettings}
            onSettingsChange={setRedirectSettings}
            onSaveSettings={handleSaveRedirectSettings}
          />
        );
      case 'analytics':
        return <AnalyticsTab resources={resources} downloadStats={downloadStats} />;
      default:
        return <OverviewTab downloadStats={downloadStats} />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">資料DL管理</h2>
        <p className="text-gray-600">資料ダウンロードページの設定と分析</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {renderTabContent()}

      {/* アクションボタン */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={handleRefreshStats}
          className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          <span>統計データを更新</span>
        </button>
        <a
          href="/download"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>ダウンロードページを確認</span>
        </a>
        <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
          <Download className="w-4 h-4" />
          <span>レポートをエクスポート</span>
        </button>
      </div>

      {/* アップロード進捗ダイアログ */}
      <UploadProgressDialog
        isOpen={isUploading}
        progress={uploadProgress}
        fileName={uploadFileName}
      />
    </div>
  );
};

export default ResourceDownloadManagement;
import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { uploadImage, deleteImage, extractPathFromUrl } from '../../lib/supabase';
import { useEntryWorksData, EntryWork } from '../../hooks/useEntryWorksData';
import EntryWorkCard from './entryWorks/EntryWorkCard';
import EntryWorkEditForm from './entryWorks/EntryWorkEditForm';
import EntryWorkSearchAndFilter from './entryWorks/EntryWorkSearchAndFilter';
import EmptyEntryWorksState from './entryWorks/EmptyEntryWorksState';
import EntryWorkStats from './entryWorks/EntryWorkStats';

const EntryWorksManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterNominated, setFilterNominated] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EntryWork | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // データ管理フック
  const {
    entryWorks,
    loading,
    error,
    setLoading,
    setError,
    fetchAllEntryWorks,
    createEntryWork,
    updateEntryWork,
    deleteEntryWork,
    updateDisplayOrder
  } = useEntryWorksData();

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchAllEntryWorks();
  }, []);

  // 検索・フィルタリング
  const filteredEntryWorks = entryWorks.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.instagram_account.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || work.department === filterDepartment;
    const matchesPeriod = filterPeriod === 'all' || work.period === filterPeriod;
    const matchesNominated = filterNominated === 'all' || 
                            (filterNominated === 'nominated' && work.is_nominated) ||
                            (filterNominated === 'not-nominated' && !work.is_nominated);
    
    return matchesSearch && matchesDepartment && matchesPeriod && matchesNominated;
  });

  // ファイル選択ハンドラ
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Supabaseアップロードハンドラ
  const handleUploadToSupabase = async () => {
    if (selectedFile && editForm) {
      setIsUploading(true);
      setUploadError('');
      
      try {
        console.log('画像アップロード開始:', selectedFile.name);

        // 古い画像がある場合は削除
        if (editForm.image_url) {
          console.log('古い画像を削除中:', editForm.image_url);
          const oldPath = extractPathFromUrl(editForm.image_url, 'entry-works-images');
          if (oldPath) {
            await deleteImage('entry-works-images', oldPath);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `entry-works/${fileName}`;

        console.log('新しい画像をアップロード中:', filePath);

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFile, 'entry-works-images', filePath);
        
        if (error) {
          console.error('アップロードエラー:', error);
          if (error.includes('Bucket not found')) {
            setUploadError('ストレージバケット「entry-works-images」が見つかりません。Supabaseダッシュボードでバケットを作成してください。');
          } else {
            setUploadError(`アップロードに失敗しました: ${error}`);
          }
          return;
        }

        if (!url) {
          console.error('URLが取得できませんでした');
          setUploadError('アップロードに失敗しました: URLが取得できませんでした');
          return;
        }
        
        console.log('アップロード成功、新しいURL:', url);

        // フォームの画像URLを更新
        setEditForm({ ...editForm, image_url: url });
        setSelectedFile(null);
        setPreviewUrl('');
        
        // ファイル入力をリセット
        const fileInput = document.getElementById('entry-work-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setUploadError('');
        console.log('画像アップロード完了');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('アップロード処理エラー:', errorMessage);
        if (errorMessage.includes('Bucket not found')) {
          setUploadError('ストレージバケット「entry-works-images」が見つかりません。Supabaseダッシュボードでバケットを作成してください。');
        } else {
          setUploadError(`アップロードに失敗しました: ${errorMessage}`);
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 画像削除ハンドラ
  const handleDeleteImage = async () => {
    if (editForm) {
      // Supabaseから画像を削除
      if (editForm.image_url) {
        const imagePath = extractPathFromUrl(editForm.image_url, 'entry-works-images');
        if (imagePath) {
          await deleteImage('entry-works-images', imagePath);
        }
      }

      setEditForm({ ...editForm, image_url: '' });
    }
    setSelectedFile(null);
    setPreviewUrl('');
    
    const fileInput = document.getElementById('entry-work-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // 編集開始
  const handleEdit = (work: EntryWork) => {
    setEditingId(work.id);
    setEditForm({ ...work });
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadError('');
  };

  // 保存
  const handleSave = async () => {
    if (editForm) {
      try {
        setIsUploading(true);
        setUploadError('');

        // バリデーション
        if (!editForm.title || !editForm.description || !editForm.instagram_account) {
          setUploadError('必須項目をすべて入力してください');
          return;
        }

        const result = await updateEntryWork(editForm.id, editForm);
        
        if (result.success) {
          setEditingId(null);
          setEditForm(null);
          setSelectedFile(null);
          setPreviewUrl('');
          setUploadError('');
          
          await fetchAllEntryWorks();
          alert('エントリー作品情報を保存しました');
        } else {
          setUploadError(result.error || '保存に失敗しました');
        }
      } catch (err) {
        setUploadError(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // キャンセル
  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadError('');
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // 入力変更ハンドラ
  const handleInputChange = (field: keyof EntryWork, value: string | boolean) => {
    console.log('EntryWorksManagement - handleInputChange:', {
      field,
      value,
      currentEditForm: editForm ? {
        id: editForm.id,
        department: editForm.department,
        hashtag: editForm.hashtag
      } : null,
      timestamp: new Date().toISOString()
    });
    
    if (editForm) {
      const updatedForm = { ...editForm, [field]: value };
      console.log('EntryWorksManagement - setEditForm更新後:', {
        field,
        value,
        updatedDepartment: updatedForm.department,
        updatedHashtag: updatedForm.hashtag,
        beforeUpdate: editForm.department,
        afterUpdate: updatedForm.department,
        isValueChanged: editForm.department !== updatedForm.department
      });
      setEditForm(updatedForm);
    }
  };

  // 順序移動
  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = entryWorks.findIndex(work => work.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= entryWorks.length) return;
    
    const newEntryWorks = [...entryWorks];
    [newEntryWorks[currentIndex], newEntryWorks[newIndex]] = [newEntryWorks[newIndex], newEntryWorks[currentIndex]];
    
    const updatedEntryWorks = newEntryWorks.map((work, index) => ({
      ...work,
      display_order: index + 1
    }));
    
    const result = await updateDisplayOrder(updatedEntryWorks);
    if (!result.success) {
      alert(`順序変更に失敗しました: ${result.error}`);
    }
  };

  // 新規追加
  const handleAddEntryWork = async () => {
    try {
      setLoading(true);
      setError('');

      const maxOrder = entryWorks.length > 0 ? Math.max(...entryWorks.map(w => w.display_order || 0)) : 0;
      
      const newWorkData = {
        title: '新しいエントリー作品',
        description: '作品の説明を入力してください',
        image_url: '',
        instagram_url: 'https://www.instagram.com/p/sample/',
        instagram_account: '@new_artist',
        department: 'creative' as const,
        hashtag: '#レミラバックスタイルC',
        period: '第1期',
        is_nominated: false,
        is_published: true,
        display_order: maxOrder + 1
      };
      
      const result = await createEntryWork(newWorkData);
      
      if (result.success && result.data) {
        handleEdit(result.data);
      } else {
        alert(`エントリー作品の追加に失敗しました: ${result.error}`);
      }
    } catch (err) {
      alert(`エントリー作品の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (confirm('このエントリー作品を削除しますか？')) {
      try {
        setIsUploading(true);
        setUploadError('');

        // 画像も削除
        const work = entryWorks.find(w => w.id === id);
        if (work?.image_url) {
          const imagePath = extractPathFromUrl(work.image_url, 'entry-works-images');
          if (imagePath) {
            await deleteImage('entry-works-images', imagePath);
          }
        }

        const result = await deleteEntryWork(id);
        
        if (result.success) {
          alert('エントリー作品が削除されました');
        } else {
          alert(`削除に失敗しました: ${result.error}`);
        }
      } catch (err) {
        alert(`削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // フィルターリセット
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterPeriod('all');
    setFilterNominated('all');
  };

  return (
    <div>
      {/* ヘッダーセクション */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">エントリー作品管理</h2>
            <p className="text-sm sm:text-base text-gray-600">コンテストエントリー作品の管理・ノミネート設定</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="/entry-works"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-sm min-h-[44px]"
            >
              <ExternalLink className="w-5 h-5" />
              <span>エントリー作品ページを表示</span>
            </a>
            <button
              onClick={handleAddEntryWork}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-sm min-h-[44px]"
            >
              <Plus className="w-5 h-5" />
              <span>新しいエントリー作品を追加</span>
            </button>
          </div>
        </div>
      </div>

      {/* 検索・フィルターセクション */}
      <EntryWorkSearchAndFilter
        searchTerm={searchTerm}
        filterDepartment={filterDepartment}
        filterPeriod={filterPeriod}
        filterNominated={filterNominated}
        showFilters={showFilters}
        totalEntryWorks={entryWorks.length}
        filteredCount={filteredEntryWorks.length}
        onSearchChange={setSearchTerm}
        onFilterDepartmentChange={setFilterDepartment}
        onFilterPeriodChange={setFilterPeriod}
        onFilterNominatedChange={setFilterNominated}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onResetFilters={handleResetFilters}
      />

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            閉じる
          </button>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      )}

      {/* エントリー作品リスト */}
      <div className="space-y-4">
        {filteredEntryWorks.map((work, index) => (
          <div
            key={work.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {editingId === work.id && editForm ? (
              <EntryWorkEditForm
                editForm={editForm}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                uploadError={uploadError}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onInputChange={handleInputChange}
                onFileSelect={handleFileSelect}
                onUploadToSupabase={handleUploadToSupabase}
                onDeleteImage={handleDeleteImage}
              />
            ) : (
              <EntryWorkCard
                work={work}
                index={index}
                totalEntryWorks={filteredEntryWorks.length}
                onEdit={handleEdit}
                onMoveUp={() => handleMove(work.id, 'up')}
                onMoveDown={() => handleMove(work.id, 'down')}
              />
            )}
          </div>
        ))}
      </div>

      {/* 空の状態表示 */}
      <EmptyEntryWorksState
        hasEntryWorks={entryWorks.length > 0}
        hasSearchResults={filteredEntryWorks.length > 0}
        onAddEntryWork={handleAddEntryWork}
        onResetSearch={handleResetFilters}
      />

      {/* 統計情報 */}
      <EntryWorkStats entryWorks={entryWorks} />
    </div>
  );
};

export default EntryWorksManagement;
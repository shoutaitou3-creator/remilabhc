import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, supabaseAdmin, uploadImage, deleteImage, extractPathFromUrl } from '../../lib/supabase';
import WorkExampleCard from './workExamples/WorkExampleCard';
import WorkExampleEditForm from './workExamples/WorkExampleEditForm';
import WorkExampleSearchAndFilter from './workExamples/WorkExampleSearchAndFilter';
import EmptyWorkExamplesState from './workExamples/EmptyWorkExamplesState';
import WorkExampleStats from './workExamples/WorkExampleStats';

interface WorkExample {
  id: string;
  title: string;
  description: string;
  image: string;
  department: 'creative' | 'reality';
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const WorkExamplesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WorkExample | null>(null);
  const [workExamples, setWorkExamples] = useState<WorkExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // 作品例データを取得
  const fetchWorkExamples = async () => {
    try {
      setLoading(true);
      console.log('作品例データ取得開始 - supabaseAdmin状況:', {
        supabaseAdminExists: !!supabaseAdmin,
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定'
      });
      
      // supabaseAdminが利用できない場合は通常のsupabaseクライアントを使用
      const client = supabaseAdmin || supabase;
      
      // 管理画面では公開/非公開に関わらずすべての作品例を取得
      const { data, error } = await client
        .from('work_examples')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('作品例データ取得エラー:', error);
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        } else {
          setError(`データの取得に失敗しました: ${error.message}`);
        }
        return;
      }

      console.log('作品例データ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          title: item.title, 
          is_published: item.is_published,
          department: item.department 
        })) || []
      });

      setWorkExamples(data || []);
      setError('');
    } catch (err) {
      console.error('作品例データ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchWorkExamples();
  }, []);

  const filteredWorkExamples = workExamples.filter(work => 
    (work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     work.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment === 'all' || work.department === filterDepartment)
  );

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
        console.log('画像アップロード開始:', {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          editFormId: editForm.id
        });

        // 古い画像がある場合は削除
        if (editForm.image) {
          console.log('古い画像削除中:', editForm.image);
          const oldPath = extractPathFromUrl(editForm.image, 'work-examples-images');
          if (oldPath) {
            await deleteImage('work-examples-images', oldPath);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `work-examples/${fileName}`;

        console.log('新しい画像アップロード中:', filePath);

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFile, 'work-examples-images', filePath);
        
        if (error) {
          console.error('画像アップロードエラー:', error);
          setUploadError(`アップロードに失敗しました: ${error}`);
          return;
        }

        if (!url) {
          console.error('画像URLが取得できませんでした');
          setUploadError('アップロードに失敗しました: URLが取得できませんでした');
          return;
        }

        console.log('画像アップロード成功、新しいURL:', url);

        // フォームの画像URLを更新
        setEditForm({ ...editForm, image: url });
        console.log('editFormの画像URL更新完了');
        setSelectedFile(null);
        setPreviewUrl('');
        
        // ファイル入力をリセット
        const fileInput = document.getElementById('work-example-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setUploadError('');
        console.log('画像アップロード処理完了');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('画像アップロード処理エラー:', errorMessage);
        setUploadError(`アップロードに失敗しました: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 画像削除ハンドラ
  const handleDeleteImage = async () => {
    if (editForm) {
      console.log('画像削除開始:', editForm.image);
      
      if (editForm.image) {
        const imagePath = extractPathFromUrl(editForm.image, 'work-examples-images');
        if (imagePath) {
          const deleteResult = await deleteImage('work-examples-images', imagePath);
          console.log('画像削除結果:', deleteResult);
        }
      }

      setEditForm({ ...editForm, image: '' });
      console.log('editFormの画像URLをクリア');
    }
    setSelectedFile(null);
    setPreviewUrl('');
    
    const fileInput = document.getElementById('work-example-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    console.log('画像削除処理完了');
  };

  const handleEdit = (workExample: WorkExample) => {
    setEditingId(workExample.id);
    setEditForm({ ...workExample });
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadError('');
  };

  const handleSave = async () => {
    if (editForm) {
      try {
        setIsUploading(true);
        setUploadError('');

        // バリデーション
        if (!editForm.title || editForm.title.trim() === '' || editForm.title === '新しい作者') {
          setUploadError('作者名を入力してください');
          setIsUploading(false);
          return;
        }

        if (!editForm.description || editForm.description.trim() === '' || editForm.description === '作品名と作品の説明を入力してください') {
          setUploadError('作品名と作品の説明を入力してください');
          setIsUploading(false);
          return;
        }

        console.log('作品例保存開始:', {
          id: editForm.id,
          title: editForm.title,
          description: editForm.description.substring(0, 50) + '...',
          image: editForm.image ? '画像あり' : '画像なし',
          department: editForm.department,
          is_published: editForm.is_published
        });

        if (!supabaseAdmin) {
          console.error('supabaseAdminクライアントが利用できません');
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        // 保存前のデータ確認
        console.log('保存するデータ:', {
          title: editForm.title,
          description: editForm.description,
          image: editForm.image,
          department: editForm.department,
          is_published: editForm.is_published
        });

        const { error } = await supabaseAdmin
          .from('work_examples')
          .update({
            title: editForm.title,
            description: editForm.description,
            image: editForm.image,
            department: editForm.department,
            is_published: editForm.is_published,
            updated_at: new Date().toISOString()
          })
          .eq('id', editForm.id);

        if (error) {
          console.error('作品例保存エラー詳細:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setUploadError(`保存に失敗しました: ${error.message}`);
          return;
        }

        console.log('作品例保存成功');

        // 保存成功後のローカルステート更新
        setWorkExamples(workExamples.map(work => 
          work.id === editForm.id ? editForm : work
        ));
        
        console.log('ローカルステート更新完了');
        
        setEditingId(null);
        setEditForm(null);
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadError('');
        
        console.log('データ再取得開始');
        await fetchWorkExamples();
        console.log('データ再取得完了');
        alert('作品例情報を保存しました');
      } catch (err) {
        console.error('作品例保存処理エラー:', err);
        setUploadError(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

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

  const handleInputChange = (field: keyof WorkExample, value: string | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = workExamples.findIndex(work => work.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= workExamples.length) return;
    
    const newWorkExamples = [...workExamples];
    [newWorkExamples[currentIndex], newWorkExamples[newIndex]] = [newWorkExamples[newIndex], newWorkExamples[currentIndex]];
    
    const updatedWorkExamples = newWorkExamples.map((work, index) => ({
      ...work,
      display_order: index + 1
    }));
    
    setWorkExamples(updatedWorkExamples);

    try {
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      for (const work of updatedWorkExamples) {
        const { error } = await supabaseAdmin
          .from('work_examples')
          .update({ display_order: work.display_order })
          .eq('id', work.id);

        if (error) {
          setError(`順序更新に失敗しました: ${error.message}`);
          return;
        }
      }
    } catch (err) {
      setError(`順序更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddWorkExample = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const maxOrder = workExamples.length > 0 ? Math.max(...workExamples.map(w => w.display_order || 0)) : 0;
      
      const insertData = {
        title: '新しい作者',
        description: '作品名と作品の説明を入力してください',
        image: '',
        department: 'creative' as const,
        is_published: true, // 初期状態で公開
        display_order: maxOrder + 1
      };
      
      console.log('作品例挿入データ:', {
        ...insertData
      });

      const { data, error } = await supabaseAdmin
        .from('work_examples')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase挿入エラー詳細:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          insertData: insertData
        });
        setError(`作品例の追加に失敗しました: ${error.message}`);
        return;
      }

      console.log('作品例挿入成功:', data);

      const newWorkExample = data as WorkExample;
      setWorkExamples([...workExamples, newWorkExample]);
      console.log('ローカルステート更新完了、編集モードに移行');
      handleEdit(newWorkExample);
    } catch (err) {
      console.error('作品例追加処理エラー:', err);
      setError(`作品例の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
  };

  return (
    <div>
      {/* ヘッダーセクション */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">作品例管理</h2>
            <p className="text-sm sm:text-base text-gray-600">作品例の追加・編集・公開管理</p>
          </div>
          <button
            onClick={handleAddWorkExample}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>新しい作品例を追加</span>
          </button>
        </div>
      </div>

      {/* 検索・フィルターセクション */}
      <WorkExampleSearchAndFilter
        searchTerm={searchTerm}
        filterDepartment={filterDepartment}
        showFilters={showFilters}
        totalWorkExamples={workExamples.length}
        filteredCount={filteredWorkExamples.length}
        onSearchChange={setSearchTerm}
        onFilterDepartmentChange={setFilterDepartment}
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

      {/* 作品例リスト */}
      <div className="space-y-4">
        {filteredWorkExamples.map((work, index) => (
          <div
            key={work.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {editingId === work.id && editForm ? (
              <WorkExampleEditForm
                editForm={editForm}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                uploadError={uploadError}
                onSave={handleSave}
                onCancel={handleCancel}
                onInputChange={handleInputChange}
                onFileSelect={handleFileSelect}
                onUploadToSupabase={handleUploadToSupabase}
                onDeleteImage={handleDeleteImage}
              />
            ) : (
              <WorkExampleCard
                work={work}
                index={index}
                totalWorkExamples={filteredWorkExamples.length}
                onEdit={handleEdit}
                onMoveUp={() => handleMove(work.id, 'up')}
                onMoveDown={() => handleMove(work.id, 'down')}
              />
            )}
          </div>
        ))}
      </div>

      {/* 空の状態表示 */}
      <EmptyWorkExamplesState
        hasWorkExamples={workExamples.length > 0}
        hasSearchResults={filteredWorkExamples.length > 0}
        onAddWorkExample={handleAddWorkExample}
        onResetSearch={handleResetFilters}
      />

      {/* 統計情報 */}
      <WorkExampleStats workExamples={workExamples} />
    </div>
  );
};

export default WorkExamplesManagement;
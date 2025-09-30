import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, supabaseAdmin, uploadImage, deleteImage, extractPathFromUrl } from '../../lib/supabase';
import JudgeCard from './judges/JudgeCard';
import JudgeEditForm from './judges/JudgeEditForm';
import EmptyJudgesState from './judges/EmptyJudgesState';

interface Judge {
  id: string;
  name: string;
  salon: string;
  instagram: string;
  image: string;
  profile: string;
  display_order: number;
}

const JudgesManagement: React.FC = () => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Judge | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // 審査員データを取得
  const fetchJudges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('judges')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      setJudges(data || []);
      setError('');
    } catch (err) {
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchJudges();
  }, []);

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
        if (editForm.image) {
          console.log('古い画像を削除中:', editForm.image);
          const oldPath = extractPathFromUrl(editForm.image, 'judges-images');
          if (oldPath) {
            const deleteResult = await deleteImage('judges-images', oldPath);
            console.log('古い画像削除結果:', deleteResult);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `judges/${fileName}`;

        console.log('新しい画像をアップロード中:', filePath);

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFile, 'judges-images', filePath);
        
        if (error) {
          console.error('アップロードエラー:', error);
          setUploadError(`アップロードに失敗しました: ${error}`);
          return;
        }

        if (!url) {
          console.error('URLが取得できませんでした');
          setUploadError('アップロードに失敗しました: URLが取得できませんでした');
          return;
        }
        
        console.log('アップロード成功、新しいURL:', url);

        // フォームの画像URLを更新
        setEditForm({ ...editForm, image: url });
        setSelectedFile(null);
        setPreviewUrl('');
        
        // ファイル入力をリセット
        const fileInput = document.getElementById('judge-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setUploadError('');
        console.log('画像アップロード完了');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('アップロード処理エラー:', errorMessage);
        setUploadError(`アップロードに失敗しました: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 画像削除ハンドラ
  const handleDeleteImage = async () => {
    if (editForm) {
      // Supabaseから画像を削除
      if (editForm.image) {
        const imagePath = extractPathFromUrl(editForm.image, 'judges-images');
        if (imagePath) {
          const { success, error } = await deleteImage('judges-images', imagePath);
          if (!success && error) {
            console.warn('画像の削除に失敗しました:', error);
          }
        }
      }

      setEditForm({ ...editForm, image: '' });
    }
    setSelectedFile(null);
    setPreviewUrl('');
    
    // ファイル入力をリセット
    const fileInput = document.getElementById('judge-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // 編集開始
  const handleEdit = (judge: Judge) => {
    setEditingId(judge.id);
    setEditForm({ ...judge });
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
        if (!editForm.name || !editForm.salon || !editForm.profile || !validateInstagramUrl(editForm.instagram)) {
          setUploadError('必須項目をすべて正しく入力してください');
          return;
        }

        if (!supabaseAdmin) {
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        console.log('審査員データを保存中...', {
          id: editForm.id,
          name: editForm.name,
          salon: editForm.salon,
          instagram: editForm.instagram,
          image: editForm.image,
          profile: editForm.profile.substring(0, 50) + '...'
        });

        const { error } = await supabaseAdmin
          .from('judges')
          .update({
            name: editForm.name,
            salon: editForm.salon,
            instagram: editForm.instagram,
            image: editForm.image,
            profile: editForm.profile,
            updated_at: new Date().toISOString()
          })
          .eq('id', editForm.id);

        if (error) {
          console.error('Supabase保存エラー:', error);
          setUploadError(`保存に失敗しました: ${error.message}`);
          return;
        }

        console.log('データベース更新成功');

        // ローカルステートを更新
        setJudges(judges.map(judge => 
          judge.id === editForm.id ? editForm : judge
        ));
        
        console.log('ローカルステート更新完了');

        // 編集モードを終了
        setEditingId(null);
        setEditForm(null);
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadError('');
        
        console.log('審査員情報の保存が完了しました');
        
        // データを再取得して最新状態を確認
        await fetchJudges();
        
        alert('審査員情報を保存しました');
      } catch (err) {
        console.error('保存処理エラー:', err);
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
    
    // プレビューURLをクリーンアップ
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // 入力変更ハンドラ
  const handleInputChange = (field: keyof Judge, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  // 審査員の順序を移動する関数
  const handleMoveJudge = async (judgeId: string, direction: 'up' | 'down') => {
    try {
      setError('');
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const currentIndex = judges.findIndex(j => j.id === judgeId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // 範囲チェック
      if (newIndex < 0 || newIndex >= judges.length) return;
      
      // 配列を複製して順序を変更
      const updatedJudges = [...judges];
      const [movedJudge] = updatedJudges.splice(currentIndex, 1);
      updatedJudges.splice(newIndex, 0, movedJudge);
      
      // display_orderを再設定
      const judgesWithNewOrder = updatedJudges.map((judge, index) => ({
        ...judge,
        display_order: index + 1
      }));
      
      // ローカルステートを更新
      setJudges(judgesWithNewOrder);
      
      // データベースを更新
      for (const judge of judgesWithNewOrder) {
        const { error } = await supabaseAdmin
          .from('judges')
          .update({ display_order: judge.display_order })
          .eq('id', judge.id);

        if (error) {
          console.error('順序更新エラー:', error);
          setError(`表示順序の更新に失敗しました: ${error.message}`);
          return;
        }
      }
      
      console.log(`審査員 ${judgeId} を${direction === 'up' ? '上' : '下'}に移動しました`);
    } catch (err) {
      console.error('順序移動処理エラー:', err);
      setError(`表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // 新しい審査員を追加
  const handleAddJudge = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      console.log('新しい審査員を追加中...');

      // 最大の表示順序を取得
      const maxOrder = judges.length > 0 ? Math.max(...judges.map(j => j.display_order || 0)) : 0;

      const { data, error } = await supabaseAdmin
        .from('judges')
        .insert({
          name: "新しい審査員",
          salon: "サロン名",
          instagram: "https://www.instagram.com/username/",
          image: "",
          profile: "プロフィールを入力してください。",
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) {
        console.error('審査員追加エラー:', error);
        setError(`審査員の追加に失敗しました: ${error.message}`);
        return;
      }

      const newJudge = data as Judge;
      setJudges([...judges, newJudge]);
      handleEdit(newJudge);
      console.log('新しい審査員が追加されました:', newJudge.id);
    } catch (err) {
      console.error('審査員追加処理エラー:', err);
      setError(`審査員の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 審査員を削除
  const handleDelete = async (id: string) => {
    if (confirm('この審査員を削除しますか？')) {
      try {
        setLoading(true);
        setError('');

        if (!supabaseAdmin) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        console.log('審査員を削除中...', id);

        // 画像も削除
        const judge = judges.find(j => j.id === id);
        if (judge?.image) {
          const imagePath = extractPathFromUrl(judge.image, 'judges-images');
          if (imagePath) {
            await deleteImage('judges-images', imagePath);
          }
        }

        const { error } = await supabaseAdmin
          .from('judges')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('審査員削除エラー:', error);
          setError(`審査員の削除に失敗しました: ${error.message}`);
          return;
        }

        setJudges(judges.filter(judge => judge.id !== id));
        console.log('審査員が削除されました:', id);
        alert('審査員が削除されました。');
      } catch (err) {
        console.error('審査員削除処理エラー:', err);
        setError(`審査員の削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Instagram URLの検証
  const validateInstagramUrl = (url: string) => {
    const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
    return instagramRegex.test(url);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">審査員管理</h2>
            <p className="text-gray-600">審査員の情報を編集・管理できます</p>
          </div>
          <button
            onClick={handleAddJudge}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>新しい審査員を追加</span>
          </button>
        </div>
      </div>

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

      {/* 審査員リスト */}
      {!loading && !error && judges.length > 0 && (
        <div className="space-y-6">
          {judges.map((judge, index) => (
            <div
              key={judge.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {editingId === judge.id && editForm ? (
                <JudgeEditForm
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
                  validateInstagramUrl={validateInstagramUrl}
                />
              ) : (
                <JudgeCard
                  judge={judge}
                  index={index}
                  totalJudges={judges.length}
                  onEdit={handleEdit}
                  onMoveUp={() => handleMoveJudge(judge.id, 'up')}
                  onMoveDown={() => handleMoveJudge(judge.id, 'down')}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && judges.length === 0 && (
        <EmptyJudgesState onAddJudge={handleAddJudge} />
      )}
    </div>
  );
};

export default JudgesManagement;
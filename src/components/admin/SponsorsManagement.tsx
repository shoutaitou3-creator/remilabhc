import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase, supabaseAdmin, uploadImage, deleteImage, extractPathFromUrl } from '../../lib/supabase';
import SponsorCard from './sponsors/SponsorCard';
import SponsorEditForm from './sponsors/SponsorEditForm';
import SearchAndFilter from './sponsors/SearchAndFilter';
import EmptySponsorsState from './sponsors/EmptySponsorsState';

interface Sponsor {
  id: string;
  name: string;
  description: string;
  award: string;
  image: string;
  rank: string;
  url: string;
  display_order: number;
}

const SponsorsManagement: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRank, setFilterRank] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Sponsor | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // 協賛企業データを取得
  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        setError(`データの取得に失敗しました: ${error.message}`);
        return;
      }

      setSponsors(data || []);
      setError('');
    } catch (err) {
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchSponsors();
  }, []);

  // ファイル選択ハンドラ
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // プレビュー用のURLを作成
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
          const oldPath = extractPathFromUrl(editForm.image, 'sponsors-images');
          if (oldPath) {
            const deleteResult = await deleteImage('sponsors-images', oldPath);
            console.log('古い画像削除結果:', deleteResult);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `sponsors/${fileName}`;

        console.log('新しい画像をアップロード中:', filePath);

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFile, 'sponsors-images', filePath);
        
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
        const fileInput = document.getElementById('sponsor-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // 成功メッセージ
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
        const imagePath = extractPathFromUrl(editForm.image, 'sponsors-images');
        if (imagePath) {
          const { success, error } = await deleteImage('sponsors-images', imagePath);
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
    const fileInput = document.getElementById('sponsor-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // 編集開始
  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id);
    setEditForm({ ...sponsor });
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
        if (!editForm.name || !editForm.description || !editForm.award || !editForm.url) {
          setUploadError('必須項目をすべて入力してください');
          return;
        }

        if (!supabaseAdmin) {
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        console.log('協賛企業データを保存中...', {
          id: editForm.id,
          name: editForm.name,
          description: editForm.description.substring(0, 50) + '...',
          award: editForm.award,
          rank: editForm.rank,
          url: editForm.url
        });

        const { error } = await supabaseAdmin
          .from('sponsors')
          .update({
            name: editForm.name,
            description: editForm.description,
            award: editForm.award,
            image: editForm.image,
            rank: editForm.rank,
            url: editForm.url,
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
        setSponsors(sponsors.map(sponsor => 
          sponsor.id === editForm.id ? editForm : sponsor
        ));
        
        console.log('ローカルステート更新完了');

        // 編集モードを終了
        setEditingId(null);
        setEditForm(null);
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadError('');
        
        console.log('協賛企業情報の保存が完了しました');
        
        // データを再取得して最新状態を確認
        await fetchSponsors();
        
        alert('協賛企業情報を保存しました');
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
  const handleInputChange = (field: keyof Sponsor, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  // 協賛企業の順序を移動する関数
  const handleMoveSponsor = async (sponsorId: string, direction: 'up' | 'down') => {
    try {
      setError('');
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const currentIndex = sponsors.findIndex(s => s.id === sponsorId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // 範囲チェック
      if (newIndex < 0 || newIndex >= sponsors.length) return;
      
      // 配列を複製して順序を変更
      const updatedSponsors = [...sponsors];
      const [movedSponsor] = updatedSponsors.splice(currentIndex, 1);
      updatedSponsors.splice(newIndex, 0, movedSponsor);
      
      // display_orderを再設定
      const sponsorsWithNewOrder = updatedSponsors.map((sponsor, index) => ({
        ...sponsor,
        display_order: index + 1
      }));
      
      // ローカルステートを更新
      setSponsors(sponsorsWithNewOrder);
      
      // データベースを更新
      for (const sponsor of sponsorsWithNewOrder) {
        const { error } = await supabaseAdmin
          .from('sponsors')
          .update({ display_order: sponsor.display_order })
          .eq('id', sponsor.id);

        if (error) {
          console.error('順序更新エラー:', error);
          setError(`表示順序の更新に失敗しました: ${error.message}`);
          return;
        }
      }
      
      console.log(`協賛企業 ${sponsorId} を${direction === 'up' ? '上' : '下'}に移動しました`);
    } catch (err) {
      console.error('順序移動処理エラー:', err);
      setError(`表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // 新しい協賛企業を追加
  const handleAddSponsor = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      console.log('新しい協賛企業を追加中...');

      // 最大の表示順序を取得
      const maxOrder = sponsors.length > 0 ? Math.max(...sponsors.map(s => s.display_order || 0)) : 0;

      const { data, error } = await supabaseAdmin
        .from('sponsors')
        .insert({
          name: "新しい協賛企業",
          description: "企業の説明を入力してください",
          award: "【新規賞】",
          image: "",
          rank: "ブロンズ",
          url: "https://example.com",
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) {
        console.error('協賛企業追加エラー:', error);
        setError(`協賛企業の追加に失敗しました: ${error.message}`);
        return;
      }

      const newSponsor = data as Sponsor;
      setSponsors([...sponsors, newSponsor]);
      handleEdit(newSponsor);
      console.log('新しい協賛企業が追加されました:', newSponsor.id);
    } catch (err) {
      console.error('協賛企業追加処理エラー:', err);
      setError(`協賛企業の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // 協賛企業を削除
  const handleDelete = async (id: string) => {
    if (confirm('この協賛企業を削除しますか？')) {
      try {
        setLoading(true);
        setError('');

        if (!supabaseAdmin) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        console.log('協賛企業を削除中...', id);

        // 画像も削除
        const sponsor = sponsors.find(s => s.id === id);
        if (sponsor?.image) {
          const imagePath = extractPathFromUrl(sponsor.image, 'sponsors-images');
          if (imagePath) {
            await deleteImage('sponsors-images', imagePath);
          }
        }

        const { error } = await supabaseAdmin
          .from('sponsors')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('協賛企業削除エラー:', error);
          setError(`協賛企業の削除に失敗しました: ${error.message}`);
          return;
        }

        setSponsors(sponsors.filter(sponsor => sponsor.id !== id));
        console.log('協賛企業が削除されました:', id);
        alert('協賛企業が削除されました。');
      } catch (err) {
        console.error('協賛企業削除処理エラー:', err);
        setError(`協賛企業の削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 検索・フィルタリング機能
  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = filterRank === 'all' || sponsor.rank === filterRank;
    return matchesSearch && matchesRank;
  });

  // 検索・フィルターのリセット
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRank('all');
  };

  return (
    <div>
      {/* ヘッダーセクション - モバイル最適化 */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">協賛企業管理</h2>
            <p className="text-sm sm:text-base text-gray-600">協賛企業の情報を編集・管理できます</p>
          </div>
          <button
            onClick={handleAddSponsor}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>新しい協賛企業を追加</span>
          </button>
        </div>
      </div>

      {/* 検索・フィルターセクション - モバイル最適化 */}
      <SearchAndFilter
        searchTerm={searchTerm}
        filterRank={filterRank}
        showFilters={showFilters}
        totalSponsors={sponsors.length}
        filteredCount={filteredSponsors.length}
        onSearchChange={setSearchTerm}
        onFilterRankChange={setFilterRank}
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

      {/* 協賛企業リスト */}
      {!loading && !error && filteredSponsors.length > 0 && (
        <div className="space-y-6">
          {filteredSponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {editingId === sponsor.id && editForm ? (
                <SponsorEditForm
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
                <SponsorCard
                  sponsor={sponsor}
                  index={index}
                  totalSponsors={filteredSponsors.length}
                  onEdit={handleEdit}
                  onMoveUp={() => handleMoveSponsor(sponsor.id, 'up')}
                  onMoveDown={() => handleMoveSponsor(sponsor.id, 'down')}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <EmptySponsorsState
          hasSponsors={sponsors.length > 0}
          hasSearchResults={filteredSponsors.length > 0}
          onAddSponsor={handleAddSponsor}
          onResetSearch={handleResetFilters}
        />
      )}
    </div>
  );
};

export default SponsorsManagement;
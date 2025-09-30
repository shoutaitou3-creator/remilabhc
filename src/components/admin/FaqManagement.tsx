import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Save,
  X,
  Calendar
} from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const FaqManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('display_order');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FAQ | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // FAQデータを取得
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      
      console.log('FAQデータ取得開始 - supabaseAdmin状況:', {
        supabaseAdminExists: !!supabaseAdmin,
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定'
      });
      
      // supabaseAdminが利用できない場合は通常のsupabaseクライアントを使用
      const client = supabaseAdmin || supabase;
      
      // 管理画面では公開/非公開に関わらずすべてのFAQを取得
      const { data, error } = await client
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('FAQデータ取得エラー:', error);
        
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        } else {
          setError(`データの取得に失敗しました: ${error.message}`);
        }
        setFaqs([]);
        return;
      }

      console.log('FAQデータ取得成功:', {
        count: data?.length || 0,
        items: data?.map(item => ({ 
          id: item.id, 
          question: item.question.substring(0, 30) + '...', 
          is_published: item.is_published 
        })) || []
      });

      setFaqs(data || []);
      setError('');
    } catch (err) {
      console.warn('FAQデータ取得処理エラー:', err);
      setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFaqs([]); // 空の配列を設定
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm({ ...faq });
  };

  const handleSave = async () => {
    if (editForm) {
      try {
        const client = supabaseAdmin || supabase;
        
        if (!supabaseAdmin) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        const { error } = await client
          .from('faqs')
          .update({
            question: editForm.question,
            answer: editForm.answer,
            is_published: editForm.is_published,
            updated_at: new Date().toISOString()
          })
          .eq('id', editForm.id);

        if (error) {
          setError(`保存に失敗しました: ${error.message}`);
          return;
        }

        setFaqs(faqs.map(faq => 
          faq.id === editForm.id ? editForm : faq
        ));
        setEditingId(null);
        setEditForm(null);
        await fetchFaqs();
        alert('FAQ情報を保存しました');
      } catch (err) {
        setError(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (field: keyof FAQ, value: string | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('このFAQを削除しますか？')) {
      try {
        const client = supabaseAdmin || supabase;
        
        if (!supabaseAdmin) {
          setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        const { error } = await client
          .from('faqs')
          .delete()
          .eq('id', id);

        if (error) {
          setError(`削除に失敗しました: ${error.message}`);
          return;
        }

        setFaqs(faqs.filter(faq => faq.id !== id));
        alert('FAQが削除されました。');
      } catch (err) {
        setError(`削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;
    
    const newFaqs = [...faqs];
    [newFaqs[currentIndex], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[currentIndex]];
    
    // 表示順序を更新
    const updatedFaqs = newFaqs.map((faq, index) => ({
      ...faq,
      display_order: index + 1
    }));
    
    setFaqs(updatedFaqs);

    // データベースを更新
    try {
      const client = supabaseAdmin || supabase;
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      for (const faq of updatedFaqs) {
        const { error } = await client
          .from('faqs')
          .update({ display_order: faq.display_order })
          .eq('id', faq.id);

        if (error) {
          setError(`順序更新に失敗しました: ${error.message}`);
          return;
        }
      }
    } catch (err) {
      setError(`順序更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAddFaq = async () => {
    try {
      const client = supabaseAdmin || supabase;
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.display_order || 0)) : 0;

      const { data, error } = await client
        .from('faqs')
        .insert({
          question: '新しい質問',
          answer: '回答を入力してください',
          is_published: true, // 初期状態で公開
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) {
        setError(`FAQの追加に失敗しました: ${error.message}`);
        return;
      }

      const newFaq = data as FAQ;
      setFaqs([...faqs, newFaq]);
      handleEdit(newFaq);
    } catch (err) {
      setError(`FAQの追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      {/* ヘッダーセクション */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">よくある質問管理</h2>
            <p className="text-sm sm:text-base text-gray-600">FAQの追加・編集・公開管理</p>
          </div>
          <button
            onClick={handleAddFaq}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-sm min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>新しいFAQを追加</span>
          </button>
        </div>
      </div>

      {/* 検索・フィルターセクション */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="space-y-4">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="質問または回答で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            />
          </div>

          {/* フィルターボタン */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">フィルター</span>
            </button>
            <div className="text-sm text-gray-500">
              {filteredFaqs.length}件 / {faqs.length}件
            </div>
          </div>

          {/* フィルターオプション */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">並び順</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  >
                    <option value="display_order">表示順</option>
                    <option value="created_at">作成日</option>
                    <option value="updated_at">更新日</option>
                  </select>
                </div>
              </div>
            </div>
          )}
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

      {/* FAQリスト */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${
              faq.is_published 
                ? 'bg-white border-gray-200 hover:shadow-md' 
                : 'bg-gray-100 border-gray-300 opacity-75 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            {editingId === faq.id && editForm ? (
              // 編集モード
              <div className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">FAQ編集</h3>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
                    >
                      <Save className="w-4 h-4" />
                      <span>保存</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
                    >
                      <X className="w-4 h-4" />
                      <span>キャンセル</span>
                    </button>
                  </div>
                </div>

                {/* 編集フォーム */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 左側：編集フォーム */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">質問</label>
                      <textarea
                        value={editForm.question}
                        onChange={(e) => handleInputChange('question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                        rows={3}
                        placeholder="質問を入力してください"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">回答</label>
                      <textarea
                        value={editForm.answer}
                        onChange={(e) => handleInputChange('answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                        rows={8}
                        placeholder="回答を入力してください"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        HTMLタグが使用できます。改行は自動的に段落に変換されます。
                      </p>
                    </div>
                  </div>

                  {/* 右側：プレビュー */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-3">リアルタイムプレビュー</h4>
                      <div className="bg-white p-4 rounded border">
                        <h5 className="font-bold text-gray-900 mb-2">{editForm.question}</h5>
                        <div className="text-gray-700 leading-relaxed">
                          {editForm.answer.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: line }}></p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 公開状態の表示と切り替え */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">公開状態</label>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                          editForm.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {editForm.is_published ? '公開中' : '非公開'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('is_published', !editForm.is_published)}
                      type="button"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                        editForm.is_published
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {editForm.is_published ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>非公開にする</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>公開する</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 表示モード
              <div className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    {/* 順序変更ボタン（デスクトップ） */}
                    <div className="hidden sm:flex flex-col space-y-1">
                      <button
                        onClick={() => handleMove(faq.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          faq.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                        }`}
                        title="上に移動"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMove(faq.id, 'down')}
                        disabled={index === filteredFaqs.length - 1}
                        className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          faq.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                        }`}
                        title="下に移動"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">
                          #{faq.display_order}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium border transition-all duration-300 ${
                          faq.is_published 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {faq.is_published ? '✓ 公開中' : '✕ 非公開'}
                        </span>
                      </div>
                      <h3 className={`text-lg sm:text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
                        faq.is_published ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {faq.question}
                      </h3>
                      <p className={`text-sm leading-relaxed line-clamp-3 mb-3 transition-colors duration-300 ${
                        faq.is_published ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {faq.answer.length > 100 
                          ? faq.answer.substring(0, 100) + '...' 
                          : faq.answer
                        }
                      </p>
                      <div className={`text-xs transition-colors duration-300 ${
                        faq.is_published ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        更新: {new Date(faq.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                    {/* モバイル用順序変更ボタン */}
                    <div className="flex sm:hidden items-center space-x-2">
                      <button
                        onClick={() => handleMove(faq.id, 'up')}
                        disabled={index === 0}
                        className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          faq.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                        }`}
                        title="上に移動"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMove(faq.id, 'down')}
                        disabled={index === filteredFaqs.length - 1}
                        className={`flex items-center justify-center w-10 h-10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          faq.is_published ? 'hover:bg-gray-100' : 'hover:bg-gray-300'
                        }`}
                        title="下に移動"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleEdit(faq)}
                      className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm min-h-[44px] ${
                        faq.is_published 
                          ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105' 
                          : 'bg-gray-500 hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>編集</span>
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className={`w-full sm:w-auto flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg transition-all duration-300 text-sm min-h-[44px] ${
                        faq.is_published 
                          ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg transform hover:scale-105' 
                          : 'bg-gray-600 hover:bg-gray-700 hover:shadow-md'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>削除</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && !loading && (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '検索結果が見つかりません' : 'FAQが登録されていません'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? '検索条件を変更してお試しください。' : '新しいFAQを追加してください。'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddFaq}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px]"
            >
              最初のFAQを追加
            </button>
          )}
        </div>
      )}

      {/* 統計情報 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">総FAQ数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{faqs.length}件</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">公開中</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {faqs.filter(f => f.is_published).length}件
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">非公開</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {faqs.filter(f => !f.is_published).length}件
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <EyeOff className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">最終更新</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {(() => {
                  if (faqs.length === 0) return '未更新';
                  const latestUpdate = faqs.reduce((latest, faq) => {
                    return new Date(faq.updated_at) > new Date(latest) ? faq.updated_at : latest;
                  }, faqs[0]?.updated_at || new Date().toISOString());
                  return new Date(latestUpdate).toLocaleDateString();
                })()}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqManagement;
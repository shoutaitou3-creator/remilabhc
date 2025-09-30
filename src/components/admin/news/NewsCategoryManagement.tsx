import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ChevronUp, 
  ChevronDown,
  Tag,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useNewsCategoriesData, NewsCategory } from '../../../hooks/useNewsCategoriesData';

const NewsCategoryManagement: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewsCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    categories,
    loading,
    error,
    fetchAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateDisplayOrder
  } = useNewsCategoriesData();

  // コンポーネントマウント時にカテゴリを取得
  useEffect(() => {
    fetchAllCategories();
  }, []);

  const presetColors = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
    '#ef4444', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#a855f7'
  ];

  // スラッグを自動生成
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim() || 'category';
  };

  const handleEdit = (category: NewsCategory) => {
    setEditingId(category.id);
    setEditForm({ ...category });
  };

  const handleSave = async () => {
    if (!editForm) return;

    try {
      setIsSubmitting(true);

      // バリデーション
      if (!editForm.name.trim()) {
        alert('カテゴリ名を入力してください');
        return;
      }

      if (!editForm.slug.trim()) {
        alert('スラッグを入力してください');
        return;
      }

      // 重複チェック（編集中のカテゴリ以外）
      const duplicateName = categories.find(cat => 
        cat.id !== editForm.id && cat.name === editForm.name
      );
      if (duplicateName) {
        alert('このカテゴリ名は既に使用されています');
        return;
      }

      const duplicateSlug = categories.find(cat => 
        cat.id !== editForm.id && cat.slug === editForm.slug
      );
      if (duplicateSlug) {
        alert('このスラッグは既に使用されています');
        return;
      }

      const result = await updateCategory(editForm.id, {
        name: editForm.name,
        slug: editForm.slug,
        color: editForm.color,
        description: editForm.description,
        is_active: editForm.is_active
      });

      if (result.success) {
        setEditingId(null);
        setEditForm(null);
        alert('カテゴリを保存しました');
      } else {
        alert(`保存に失敗しました: ${result.error}`);
      }
    } catch (err) {
      alert(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleInputChange = (field: keyof NewsCategory, value: string | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleNameChange = (name: string) => {
    if (editForm) {
      const slug = generateSlug(name);
      setEditForm({ 
        ...editForm, 
        name, 
        slug 
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      setIsSubmitting(true);

      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.display_order)) : 0;
      
      const newCategoryData = {
        name: '新しいカテゴリ',
        slug: 'new-category',
        color: '#6b7280',
        description: 'カテゴリの説明を入力してください',
        is_active: true,
        display_order: maxOrder + 1
      };

      const result = await createCategory(newCategoryData);
      
      if (result.success && result.data) {
        handleEdit(result.data);
      } else {
        alert(`カテゴリの追加に失敗しました: ${result.error}`);
      }
    } catch (err) {
      alert(`カテゴリの追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;

    if (confirm(`「${category.name}」カテゴリを削除しますか？\n\n注意: このカテゴリを使用している既存のお知らせは「未分類」になります。`)) {
      try {
        setIsSubmitting(true);

        const result = await deleteCategory(id);
        
        if (result.success) {
          alert('カテゴリが削除されました');
        } else {
          alert(`削除に失敗しました: ${result.error}`);
        }
      } catch (err) {
        alert(`削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    
    const newCategories = [...categories];
    [newCategories[currentIndex], newCategories[newIndex]] = [newCategories[newIndex], newCategories[currentIndex]];
    
    const updatedCategories = newCategories.map((cat, index) => ({
      ...cat,
      display_order: index + 1
    }));
    
    const result = await updateDisplayOrder(updatedCategories);
    if (!result.success) {
      alert(`順序変更に失敗しました: ${result.error}`);
    }
  };

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">カテゴリ管理</h3>
            <p className="text-gray-600">お知らせのカテゴリを追加・編集・管理できます</p>
          </div>
          <button
            onClick={handleAddCategory}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm min-h-[44px] disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>追加中...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>新しいカテゴリを追加</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
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
          <p className="text-gray-600">カテゴリデータを読み込み中...</p>
        </div>
      )}

      {/* カテゴリリスト */}
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`border rounded-lg overflow-hidden transition-all duration-300 ${
              category.is_active 
                ? 'border-gray-200 bg-white hover:shadow-md' 
                : 'border-gray-300 bg-gray-50 opacity-75'
            }`}
          >
            {editingId === category.id && editForm ? (
              // 編集モード
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
                  <h4 className="text-lg font-bold text-gray-900">カテゴリ編集</h4>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>保存中...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>保存</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>キャンセル</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>削除</span>
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 左側：基本情報 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        カテゴリ名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base min-h-[44px]"
                        placeholder="カテゴリ名を入力"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        スラッグ（URL用）<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-mono min-h-[44px]"
                        placeholder="category-slug"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        英数字とハイフンのみ使用可能（カテゴリ名から自動生成されます）
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        説明
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base resize-none"
                        placeholder="カテゴリの説明を入力"
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        文字数: {editForm.description.length}文字
                      </div>
                    </div>
                  </div>

                  {/* 右側：色設定とプレビュー */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        カテゴリ色
                      </label>
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="color"
                          value={editForm.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer min-h-[44px]"
                        />
                        <input
                          type="text"
                          value={editForm.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm min-h-[44px]"
                          placeholder="#000000"
                        />
                      </div>
                      
                      {/* プリセットカラー */}
                      <div className="grid grid-cols-6 gap-2">
                        {presetColors.map((color, colorIndex) => (
                          <button
                            key={colorIndex}
                            type="button"
                            onClick={() => handleInputChange('color', color)}
                            className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform min-h-[32px]"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* プレビュー */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">表示プレビュー</h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-xs px-2 py-1 rounded font-medium text-white"
                            style={{ backgroundColor: editForm.color }}
                          >
                            {editForm.name}
                          </span>
                          <span className="text-sm text-gray-600">お知らせタイトル例</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          フィルター表示: {editForm.name}
                        </div>
                      </div>
                    </div>

                    {/* 有効/無効切り替え */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">状態</label>
                          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                            editForm.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {editForm.is_active ? '有効' : '無効'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleInputChange('is_active', !editForm.is_active)}
                          type="button"
                          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] ${
                            editForm.is_active
                              ? 'bg-gray-600 hover:bg-gray-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {editForm.is_active ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span>無効にする</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>有効にする</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* バリデーション警告 */}
                {(!editForm.name.trim() || !editForm.slug.trim()) && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-yellow-800 text-sm">
                        <strong>注意:</strong> 必須項目（*）をすべて入力してください。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 表示モード
              <div className="p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* 順序変更ボタン（デスクトップ） */}
                    <div className="hidden sm:flex flex-col space-y-1">
                      <button
                        onClick={() => handleMove(category.id, 'up')}
                        disabled={index === 0 || isSubmitting}
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="上に移動"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMove(category.id, 'down')}
                        disabled={index === categories.length - 1 || isSubmitting}
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="下に移動"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* カテゴリ情報 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          #{category.display_order}
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.is_active ? '有効' : '無効'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        スラッグ: <code className="bg-gray-100 px-1 rounded font-mono text-xs">{category.slug}</code>
                      </p>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        更新: {new Date(category.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                    {/* モバイル用順序変更ボタン */}
                    <div className="flex sm:hidden items-center space-x-2">
                      <button
                        onClick={() => handleMove(category.id, 'up')}
                        disabled={index === 0 || isSubmitting}
                        className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="上に移動"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleMove(category.id, 'down')}
                        disabled={index === categories.length - 1 || isSubmitting}
                        className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="下に移動"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleEdit(category)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px] disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      <span>編集</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 空の状態 */}
      {!loading && categories.length === 0 && !error && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">カテゴリが登録されていません</h3>
          <p className="text-gray-600 mb-6">新しいカテゴリを追加してください。</p>
          <button
            onClick={handleAddCategory}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium min-h-[44px] disabled:cursor-not-allowed"
          >
            最初のカテゴリを追加
          </button>
        </div>
      )}

      {/* 統計情報 */}
      {!loading && categories.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">総カテゴリ数</p>
                <p className="text-2xl font-bold text-blue-900">{categories.length}個</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">有効カテゴリ</p>
                <p className="text-2xl font-bold text-green-900">
                  {categories.filter(c => c.is_active).length}個
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">無効カテゴリ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => !c.is_active).length}個
                </p>
              </div>
              <EyeOff className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      )}

      {/* 使用方法の説明 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">カテゴリ管理について</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• カテゴリ名を変更すると、スラッグ（URL用識別子）が自動生成されます</li>
          <li>• カテゴリ色は、お知らせ一覧でのバッジ表示に使用されます</li>
          <li>• 無効にしたカテゴリは、新しいお知らせ作成時に選択できなくなります</li>
          <li>• 順序は、フィルター選択時の表示順序に影響します</li>
          <li>• カテゴリを削除すると、そのカテゴリを使用している既存のお知らせは「未分類」になります</li>
        </ul>
      </div>
    </div>
  );
};

export default NewsCategoryManagement;
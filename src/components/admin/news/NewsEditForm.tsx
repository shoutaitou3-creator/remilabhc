import React from 'react';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { NewsItem } from '../../../hooks/useNewsData';
import { useNewsCategoriesData } from '../../../hooks/useNewsCategoriesData';


interface NewsEditFormProps {
  item: NewsItem;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof NewsItem, value: string | boolean) => void;
}

const NewsEditForm: React.FC<NewsEditFormProps> = ({
  item,
  onSave,
  onCancel,
  onInputChange
}) => {
  const { categories: availableCategories, fetchAllCategories, loading: categoriesLoading } = useNewsCategoriesData();

  // コンポーネントマウント時に有効なカテゴリを取得
  React.useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">お知らせ編集</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <button
            onClick={onSave}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors text-sm min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>キャンセル</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* 左側：基本情報 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="お知らせのタイトルを入力"
            />
            <div className="mt-2 text-sm text-gray-500">
              文字数: {item.title.length}文字
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <div className="space-y-2">
                <select
                  value={item.category_id || ''}
                  onChange={(e) => {
                    const categoryId = e.target.value || null;
                    onInputChange('category_id', categoryId);
                  }}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? 'カテゴリを読み込み中...' : 'カテゴリを選択してください'}
                  </option>
                  {availableCategories.filter(cat => cat.is_active).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  {availableCategories.filter(cat => !cat.is_active).length > 0 && (
                    <optgroup label="無効なカテゴリ">
                      {availableCategories.filter(cat => !cat.is_active).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} （無効）
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
                
                {categoriesLoading && (
                  <div className="text-xs text-gray-500 mt-1">
                    カテゴリデータを読み込み中...
                  </div>
                )}
                
                {/* 選択されたカテゴリのプレビュー */}
                {item.category_id && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">プレビュー:</span>
                    {(() => {
                      const selectedCategory = availableCategories.find(cat => cat.id === item.category_id);
                      return selectedCategory ? (
                        <span 
                          className="text-xs px-2 py-1 rounded font-medium text-white"
                          style={{ backgroundColor: selectedCategory.color }}
                        >
                          {selectedCategory.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">カテゴリが見つかりません</span>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開日
              </label>
              <input
                type="date"
                value={item.publish_date}
                onChange={(e) => onInputChange('publish_date', e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              リンクURL
            </label>
            <input
              type="url"
              value={item.link_url}
              onChange={(e) => onInputChange('link_url', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              リンクテキスト
            </label>
            <input
              type="text"
              value={item.link_text}
              onChange={(e) => onInputChange('link_text', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="詳細を見る"
            />
          </div>
        </div>

        {/* 右側：コンテンツと公開状態 */}
        <div className="space-y-4">
          {/* 公開先サイト選択と公開状態 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 左側：公開先サイト選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                公開先サイト <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-3">
                  このお知らせを表示するサイトを選択してください（複数選択可能）
                </p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">REMILA BHCサイト</span>
                    <span className="text-xs text-gray-500">（現在のサイト）</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">REMILA BHC 協賛募集サイト</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">RESUSY公式サイト</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">REMILA LPサイト</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">REMILA CSサイト</span>
                  </label>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">選択されたサイト数: 1個</span>
                    <div className="space-x-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        すべて選択
                      </button>
                      <button
                        type="button"
                        className="text-gray-600 hover:text-gray-800 underline"
                      >
                        すべて解除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：公開状態管理 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                公開状態 <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center mb-4">
                    <span className={`text-lg px-4 py-2 rounded-full font-medium ${
                      item.is_published 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {item.is_published ? '✓ 公開中' : '✕ 非公開'}
                    </span>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-xs text-gray-600 mb-2">
                      {item.is_published 
                        ? 'このお知らせは選択されたサイトで公開されています' 
                        : 'このお知らせは非公開状態です'
                      }
                    </p>
                    {item.is_published && (
                      <p className="text-xs text-blue-600">
                        公開日: {item.publish_date}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onInputChange('is_published', !item.is_published)}
                  type="button"
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                    item.is_published
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {item.is_published ? (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              本文 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={item.content}
              onChange={(e) => onInputChange('content', e.target.value)}
              rows={8}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              placeholder="お知らせの内容を入力してください"
            />
            <p className="text-xs text-gray-500 mt-1">
              HTMLタグが使用できます。改行は自動的に段落に変換されます。
            </p>
            <div className="mt-2 text-sm text-gray-500">
              文字数: {item.content.length}文字
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリが選択されていない場合の警告 */}
      {!item.category_id && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> カテゴリが選択されていません。お知らせを公開する前にカテゴリを選択してください。
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsEditForm;
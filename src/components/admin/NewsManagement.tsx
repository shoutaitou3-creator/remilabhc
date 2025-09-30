import React, { useState } from 'react';
import { useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import NewsHeader from './news/NewsHeader';
import NewsSearchAndFilter from './news/NewsSearchAndFilter';
import NewsCard from './news/NewsCard';
import NewsEditForm from './news/NewsEditForm';
import NewsStats from './news/NewsStats';
import EmptyNewsState from './news/EmptyNewsState';
import NewsCategoryManagement from './news/NewsCategoryManagement';
import { useNewsData, NewsItem } from '../../hooks/useNewsData';
import { useNewsCategoriesData } from '../../hooks/useNewsCategoriesData';

const NewsManagement: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  // データベースからお知らせを取得
  const { 
    newsItems, 
    loading, 
    error, 
    fetchAllNews, 
    createNews, 
    updateNews, 
    deleteNews, 
    updateDisplayOrder 
  } = useNewsData();

  // カテゴリデータを取得
  const { 
    categories: availableCategories, 
    fetchAllCategories 
  } = useNewsCategoriesData();

  // コンポーネントマウント時に全お知らせを取得
  useEffect(() => {
    fetchAllNews();
  }, []);

  // カテゴリデータを別途取得
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // フィルター用カテゴリリストを生成
  const filterCategories = [
    { value: 'all', label: 'すべて' },
    ...availableCategories.map(cat => ({
      value: cat.slug,
      label: cat.name + (!cat.is_active ? '（無効）' : '')
    })),
    // 後方互換性のための従来カテゴリ
    { value: 'news', label: '新着情報（旧）' },
    { value: 'press', label: 'プレスリリース（旧）' },
    { value: 'update', label: '更新情報（旧）' },
    { value: 'event', label: 'イベント（旧）' }
  ];

  // カテゴリ表示の取得
  const getCategoryDisplay = (item: NewsItem) => {
    // 新しいカテゴリシステム（news_categoriesテーブル）
    if (item.news_category && item.news_category.name) {
      return {
        name: item.news_category.name,
        color: item.news_category.color
      };
    }
    
    // category_idがあるが、news_categoryが取得できていない場合
    if (item.category_id) {
      const category = availableCategories.find(cat => cat.id === item.category_id);
      if (category) {
        return {
          name: category.name,
          color: category.color
        };
      }
    }
    
    // フォールバック: 旧形式のカテゴリ
    const fallbackColors = {
      'news': '#3b82f6',
      'press': '#8b5cf6', 
      'update': '#10b981',
      'event': '#f59e0b'
    };
    
    const fallbackLabels = {
      'news': '新着情報',
      'press': 'プレスリリース',
      'update': '更新情報', 
      'event': 'イベント'
    };
    
    return {
      name: fallbackLabels[item.category as keyof typeof fallbackLabels] || 'お知らせ',
      color: fallbackColors[item.category as keyof typeof fallbackColors] || '#6b7280'
    };
  };

  // 検索・フィルタリング
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // カテゴリフィルタリング（新旧両対応、category_idベース）
    let matchesCategory = false;
    
    if (selectedCategory === 'all') {
      matchesCategory = true;
    } else {
      // 新しいカテゴリシステム（category_idベース）
      if (item.category_id === selectedCategory) {
        matchesCategory = true;
      }
      // スラッグベースのマッチング
      else if (item.news_category && item.news_category.slug === selectedCategory) {
        matchesCategory = true;
      }
      // availableCategoriesからスラッグでマッチング
      else if (item.category_id && availableCategories.find(cat => cat.id === item.category_id)?.slug === selectedCategory) {
        matchesCategory = true;
      }
      // 旧形式のカテゴリ（後方互換性）
      else if (item.category === selectedCategory) {
        matchesCategory = true;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSave = async () => {
    if (editForm) {
      const result = await updateNews(editForm.id, editForm);
      if (result.success) {
        setEditingId(null);
        setEditForm(null);
        alert('お知らせを保存しました');
      } else {
        alert(`保存に失敗しました: ${result.error}`);
      }
    }
  };

  const handleInputChange = (field: keyof NewsItem, value: string | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('このお知らせを削除しますか？')) {
      const result = await deleteNews(id);
      if (result.success) {
        alert('お知らせを削除しました');
      } else {
        alert(`削除に失敗しました: ${result.error}`);
      }
    }
  };

  const handleMoveNews = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = newsItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= newsItems.length) return;
    
    const newItems = [...newsItems];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));
    
    const result = await updateDisplayOrder(updatedItems);
    if (!result.success) {
      alert(`順序変更に失敗しました: ${result.error}`);
    }
  };

  const handleAddNews = async () => {
    const maxOrder = newsItems.length > 0 ? Math.max(...newsItems.map(item => item.display_order || 0)) : 0;
    
    // デフォルトカテゴリを「新着情報」に設定
    let defaultCategory = availableCategories.find(cat => 
      cat.is_active && (cat.name === '新着情報' || cat.slug === 'news' || cat.slug === 'shinchaku-joho')
    );
    
    // 「新着情報」が見つからない場合は最初の有効なカテゴリを使用
    if (!defaultCategory) {
      defaultCategory = availableCategories.find(cat => cat.is_active);
    }
    
    console.log('新規お知らせ作成 - デフォルトカテゴリ:', {
      found: !!defaultCategory,
      categoryName: defaultCategory?.name,
      categoryId: defaultCategory?.id,
      availableCount: availableCategories.length
    });
    
    const newNewsData = {
      title: '新しいお知らせのタイトルを入力してください',
      content: 'お知らせの詳細内容を入力してください。\n\nHTMLタグも使用できます。',
      category: 'news' as const,
      category_id: defaultCategory?.id || null,
      link_url: '',
      link_text: '',
      image: '',
      video_url: '',
      attachments: [],
      is_published: false, // 初期状態は非公開
      publish_date: new Date().toISOString().split('T')[0],
      display_order: maxOrder + 1
    };
    
    console.log('新規お知らせデータ:', newNewsData);
    
    const result = await createNews(newNewsData);
    if (result.success && result.data) {
      console.log('新規お知らせ作成成功:', result.data.id);
      setEditingId(result.data.id);
      setEditForm(result.data);
    } else {
      console.error('新規お知らせ作成失敗:', result.error);
      alert(`お知らせの作成に失敗しました: ${result.error}`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  return (
    <div>
      <NewsHeader 
        onAddNews={handleAddNews} 
        onShowCategoryManagement={() => setShowCategoryManagement(true)}
      />

      {/* カテゴリ管理モーダル */}
      {showCategoryManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">カテゴリ管理</h2>
                  <p className="text-sm text-gray-600">お知らせのカテゴリを管理します</p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryManagement(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <NewsCategoryManagement />
            </div>
          </div>
        </div>
      )}

      <NewsSearchAndFilter
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        showFilters={showFilters}
        filteredCount={filteredNews.length}
        totalCount={newsItems.length}
        categories={filterCategories}
        availableCategories={availableCategories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onResetFilters={handleResetFilters}
      />

      {/* お知らせリスト */}
      <div className="space-y-6">
        {filteredNews.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl shadow-sm border overflow-hidden"
          >
            {editingId === item.id ? (
              <NewsEditForm
                item={editForm!}
                onSave={handleSave}
                onCancel={handleCancel}
                onInputChange={handleInputChange}
              />
            ) : (
              <NewsCard
                item={item}
                index={index}
                totalItems={filteredNews.length}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMoveNews={handleMoveNews}
                getCategoryDisplay={getCategoryDisplay}
              />
            )}
          </div>
        ))}
      </div>

      <EmptyNewsState
        hasNews={newsItems.length > 0}
        hasSearchResults={filteredNews.length > 0}
        onAddNews={handleAddNews}
        onResetSearch={handleResetFilters}
      />

      <NewsStats newsItems={newsItems} />
    </div>
  );
};

export default NewsManagement;
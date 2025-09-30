import React from 'react';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSiteMetadata } from './hooks/useSiteMetadata';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsSection from './components/NewsSection';
import ContestOverview from './components/ContestOverview';
import ContestDetails from './components/ContestDetails';
import WorkExamplesSection from './components/WorkExamplesSection';
import EntryWorksSection from './components/EntryWorksSection';
import JudgesSection from './components/JudgesSection';
import HowToEnter from './components/HowToEnter';
import SponsorCompanies from './components/SponsorCompanies';
import SponsorCTA from './components/SponsorCTA';
import PrizesSection from './components/PrizesSection';
import FAQSection from './components/FAQSection';
import EntryForm from './components/EntryForm';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SharedNewsDemo from './components/SharedNewsDemo';
import SharedSponsorsDemo from './components/SharedSponsorsDemo';
import DownloadPage from './components/DownloadPage';
import RemilaApplicationPage from './components/RemilaApplicationPage';
import DesignSpecificationPage from './components/DesignSpecificationPage';
import EntryWorksPage from './components/EntryWorksPage';

const AppContent = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { settings: siteSettings, loading: metadataLoading } = useSiteMetadata();

  // URLパラメータからサイトスラッグを取得
  const getSiteSlugFromUrl = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('app') || 'remila-bhc';
  };

  const currentSiteSlug = getSiteSlugFromUrl();

  // URLパラメータに'app'がある場合は管理者ログイン画面を表示
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appParam = urlParams.get('app');
    
    // ローディング中は処理しない
    if (loading) return;
    
    console.log('App.tsx useEffect - 認証状態確認:', {
      appParam,
      isAuthenticated,
      loading,
      currentUrl: window.location.href,
      pathname: window.location.pathname
    });
    
    // 管理者モードの判定を改善
    if (appParam && !isAuthenticated && !loading) {
      console.log('管理者ログイン画面を表示:', appParam);
      setShowAdminLogin(true);
    } else if (appParam && isAuthenticated) {
      console.log('既に認証済み、管理画面を表示');
      setShowAdminLogin(false);
    } else if (!appParam) {
      console.log('通常モード');
      setShowAdminLogin(false);
    }
  }, [isAuthenticated, loading]);

  // 資料ダウンロードページの表示判定
  const isDownloadPage = window.location.pathname === '/download';
  const isApplicationPage = window.location.pathname === '/application';
  const isDesignSpecPage = window.location.pathname === '/design-spec';
  const isEntryWorksPage = window.location.pathname === '/entry-works';

  // Supabase設定エラーの場合でも、ダウンロードページは表示する
  if (isDownloadPage) {
    console.log('ダウンロードページを表示');
    return <DownloadPage />;
  }

  // レミラ申し込みページの表示
  if (isApplicationPage) {
    console.log('申し込みページを表示');
    return <RemilaApplicationPage />;
  }

  // デザイン仕様ページの表示
  if (isDesignSpecPage) {
    console.log('デザイン仕様ページを表示');
    return <DesignSpecificationPage />;
  }

  // エントリー作品ページの表示
  if (isEntryWorksPage) {
    console.log('エントリー作品ページを表示');
    return <EntryWorksPage />;
  }

  // 認証状態の読み込み中はローディング表示
  if (loading || metadataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? '認証状態を確認中...' : 'サイト設定を読み込み中...'}
            ({currentSiteSlug})
          </p>
        </div>
      </div>
    );
  }

  // 管理者としてログインしている場合は管理画面を表示
  if (isAuthenticated) {
    console.log('認証済み - 管理画面を表示');
    return <AdminDashboard />;
  }

  // デモモードの確認
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo') === 'shared-news') {
    console.log('デモモード: shared-news');
    return <SharedNewsDemo />;
  } else if (urlParams.get('demo') === 'shared-sponsors') {
    console.log('デモモード: shared-sponsors');
    return <SharedSponsorsDemo />;
  }

  // 管理者ログイン画面を表示
  if (showAdminLogin) {
    console.log('管理者ログイン画面を表示');
    return (
      <AdminLogin 
        onLoginSuccess={() => setShowAdminLogin(false)}
      />
    );
  }

  // 通常のサイト表示
  console.log('通常のサイトを表示');
  return (
    <div className="min-h-screen bg-white">
      <Header siteSettings={siteSettings} />
      <Hero />
      <NewsSection />
      <ContestOverview />
      <EntryWorksSection />
      <WorkExamplesSection />
      <ContestDetails />
      <JudgesSection />
      <PrizesSection />
      <SponsorCompanies />
      <SponsorCTA />
      <HowToEnter />
      <FAQSection />
      <EntryForm />
      <Footer 
        siteSettings={siteSettings}
        onAdminClick={() => setShowAdminLogin(true)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
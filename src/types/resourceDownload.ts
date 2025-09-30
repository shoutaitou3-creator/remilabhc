// 資料ダウンロード管理の型定義
export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_size: number;
  file_url: string;
  file_type: string;
  icon_url: string;
  category_id: string | null;
  is_published: boolean;
  download_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
  category?: ResourceCategory;
}

export interface ResourceFormData {
  title: string;
  description: string;
  category_id: string | null;
  uploadedFile: File | null;
  uploadedFileUrl: string;
  iconFile: File | null;
  iconUrl: string;
  is_published: boolean;
}

export interface ResourceDownload {
  id: string;
  resource_id: string;
  ip_address: string;
  user_agent: string;
  downloaded_at: string;
}

export interface DownloadStats {
  totalDownloads: number;
  todayDownloads: number;
  conversionRate: number;
  popularResource: string;
  recentActivity?: Array<{
    id: string;
    downloaded_at: string;
    resource?: {
      title: string;
    };
  }>;
}

export interface RedirectSettings {
  id?: string;
  site_slug?: string;
  redirectUrl: string;
  redirectDelay: number;
  showCompletionMessage: boolean;
  enableAutoRedirect: boolean;
  created_at?: string;
  updated_at?: string;
}

export type TabType = 'overview' | 'resources' | 'redirect' | 'analytics';
// ネイティブブラウザダウンロード用のヘルパー関数

/**
 * fetch APIを使用した強制ダウンロード処理
 * サーバー側のContent-Dispositionに依存せず、クライアント側で強制的にダウンロードを実行
 * @param fileUrl ダウンロードするファイルのURL
 * @param fileName 保存時のファイル名
 * @param options ダウンロードオプション
 */
export const fetchDownloadFile = async (
  fileUrl: string, 
  fileName: string,
  options: {
    onStart?: () => void;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: string) => void;
    maxSize?: number;
    timeout?: number;
  } = {}
): Promise<{ success: boolean; error?: string }> => {
  const { 
    onStart, 
    onProgress, 
    onComplete, 
    onError,
    maxSize = 100 * 1024 * 1024, // 100MB
    timeout = 60000 // 60秒
  } = options;

  // モバイルデバイスの検出
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  console.log('ダウンロード環境検出:', {
    isMobile,
    isIOS,
    userAgent: navigator.userAgent,
    fileUrl,
    fileName
  });

  // モバイルデバイスの場合は、より確実な方法を使用
  if (isMobile) {
    console.log('モバイルデバイス検出 - 専用ダウンロード処理を実行');
    return mobileDownloadFile(fileUrl, fileName, options);
  }

  try {
    console.log('fetch APIダウンロード開始:', { fileUrl, fileName });

    // ダウンロード開始コールバック
    if (onStart) onStart();
    if (onProgress) onProgress(5);

    // AbortControllerでタイムアウト制御
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('ダウンロードタイムアウト');
    }, timeout);

    if (onProgress) onProgress(10);

    // ファイルをfetchで取得
    const response = await fetch(fileUrl, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/pdf,*/*'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Content-Lengthヘッダーからファイルサイズを確認
    const contentLength = response.headers.get('Content-Length');
    const fileSize = contentLength ? parseInt(contentLength) : 0;

    if (fileSize > maxSize) {
      throw new Error(`ファイルサイズが制限（${Math.round(maxSize / 1024 / 1024)}MB）を超えています`);
    }

    if (onProgress) onProgress(30);

    // レスポンスをBlobとして取得
    const blob = await response.blob();
    console.log('Blob作成完了:', { size: blob.size, type: blob.type });

    if (onProgress) onProgress(70);

    // BlobからダウンロードURLを作成
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // ダウンロード用のリンク要素を作成
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    link.rel = 'noopener noreferrer';
    link.target = '_blank'; // モバイル対応
    
    // DOMに追加してクリック実行
    document.body.appendChild(link);
    link.click();
    
    if (onProgress) onProgress(90);
    
    // クリーンアップを遅延実行（ブラウザがダウンロードを開始するまで待機）
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(downloadUrl);
      } catch (cleanupError) {
        console.warn('クリーンアップエラー:', cleanupError);
      }
    }, 1000);

    if (onProgress) onProgress(100);
    console.log('fetch APIダウンロード完了:', fileName);

    // 完了コールバック
    if (onComplete) onComplete();

    return { success: true };
    
  } catch (error) {
    console.error('fetch APIダウンロードエラー:', error);
    const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
    
    // エラーコールバック
    if (onError) onError(errorMessage);
    
    // タイムアウトエラーの場合はネイティブダウンロードにフォールバック
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('タイムアウトのため、ネイティブダウンロードにフォールバック');
      return nativeDownloadFile(fileUrl, fileName, { onStart, onComplete, onError });
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

/**
 * モバイル専用ダウンロード処理
 * モバイルブラウザの制約に対応した特別な処理
 */
export const mobileDownloadFile = async (
  fileUrl: string, 
  fileName: string,
  options: {
    onStart?: () => void;
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: string) => void;
  } = {}
): Promise<{ success: boolean; error?: string }> => {
  const { onStart, onProgress, onComplete, onError } = options;

  try {
    console.log('モバイルダウンロード開始:', { fileUrl, fileName });

    if (onStart) onStart();
    if (onProgress) onProgress(10);

    // iOSの場合は新しいタブで開く方式を使用
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      console.log('iOS検出 - 新しいタブで開く方式を使用');
      
      // iOSでは新しいタブで開いてユーザーに保存を促す
      const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        throw new Error('ポップアップがブロックされました。ブラウザの設定を確認してください。');
      }
      
      if (onProgress) onProgress(100);
      if (onComplete) onComplete();
      
      return { success: true };
    }
    
    // Android等の場合は、まずfetch APIを試行
    try {
      if (onProgress) onProgress(30);
      
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,application/octet-stream,*/*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      if (onProgress) onProgress(60);
      
      const blob = await response.blob();
      console.log('モバイル用Blob作成完了:', { size: blob.size, type: blob.type });
      
      if (onProgress) onProgress(80);
      
      // モバイル用のダウンロード処理
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // 複数の方法を試行
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      link.rel = 'noopener noreferrer';
      
      // ユーザーアクションとして認識されるよう、即座に実行
      document.body.appendChild(link);
      
      // モバイルでは複数回クリックを試行
      link.click();
      
      // 代替手段として、少し遅延してもう一度クリック
      setTimeout(() => {
        try {
          link.click();
        } catch (e) {
          console.warn('2回目のクリック失敗:', e);
        }
      }, 100);
      
      // クリーンアップ
      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          window.URL.revokeObjectURL(downloadUrl);
        } catch (cleanupError) {
          console.warn('モバイルクリーンアップエラー:', cleanupError);
        }
      }, 2000);
      
      if (onProgress) onProgress(100);
      if (onComplete) onComplete();
      
      return { success: true };
      
    } catch (fetchError) {
      console.warn('モバイルfetch失敗、直接リンクにフォールバック:', fetchError);
      
      // fetch失敗時は直接リンクを開く
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
      if (onProgress) onProgress(100);
      if (onComplete) onComplete();
      
      return { success: true };
    }
    
  } catch (error) {
    console.error('モバイルダウンロードエラー:', error);
    const errorMessage = error instanceof Error ? error.message : 'モバイルダウンロードに失敗しました';
    
    if (onError) onError(errorMessage);
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

/**
 * ネイティブブラウザダウンロード処理
 * HTML5のdownload属性を使用した高速ダウンロード
 * @param fileUrl ダウンロードするファイルのURL
 * @param fileName 保存時のファイル名
 * @param options ダウンロードオプション
 */
export const nativeDownloadFile = (
  fileUrl: string, 
  fileName: string,
  options: {
    onStart?: () => void;
    onComplete?: () => void;
    onError?: (error: string) => void;
  } = {}
): { success: boolean; error?: string } => {
  const { onStart, onComplete, onError } = options;

  try {
    console.log('ネイティブダウンロード開始:', { fileUrl, fileName });

    // ダウンロード開始コールバック
    if (onStart) onStart();

    // モバイルデバイスの検出
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // iOSの場合は新しいタブで開く
    if (isIOS) {
      console.log('iOS検出 - 新しいタブで開く');
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      if (onComplete) onComplete();
      return { success: true };
    }
    
    // ダウンロード用のリンク要素を作成
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    
    // セキュリティとパフォーマンスの向上
    link.rel = 'noopener noreferrer';
    link.target = '_blank'; // モバイル対応
    link.style.display = 'none';
    
    // モバイルの場合は追加の属性を設定
    if (isMobile) {
      link.setAttribute('type', 'application/octet-stream');
    }
    
    // ユーザーアクションとして認識されるよう即座に実行
    document.body.appendChild(link);
    link.click();
    
    // モバイルでは少し遅延してもう一度クリック
    if (isMobile) {
      setTimeout(() => {
        try {
          link.click();
        } catch (e) {
          console.warn('モバイル2回目クリック失敗:', e);
        }
      }, 100);
    }
    
    // DOMから即座に削除（メモリリーク防止）
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      } catch (e) {
        console.warn('リンク削除エラー:', e);
      }
    }, isMobile ? 1000 : 100);
    
    console.log('ネイティブダウンロード完了:', fileName);

    // 完了コールバック
    if (onComplete) onComplete();

    return { success: true };
    
  } catch (error) {
    console.error('ネイティブダウンロードエラー:', error);
    const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
    
    // エラーコールバック
    if (onError) onError(errorMessage);
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

/**
 * 旧式のBlob処理ダウンロード（後方互換性のため保持）
 * 現在は使用されていませんが、特殊な要件がある場合に利用可能
 */
export const blobDownloadFile = async (
  fileUrl: string, 
  fileName: string,
  options: {
    maxSize?: number;
    timeout?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<{ success: boolean; error?: string }> => {
  const { maxSize = 2 * 1024 * 1024, timeout = 30000, onProgress } = options;

  try {
    console.log('Blobダウンロード開始:', { fileUrl, fileName, maxSize, timeout });

    // AbortControllerでタイムアウト制御
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('ダウンロードタイムアウト');
    }, timeout);

    // 進捗レポート
    if (onProgress) onProgress(10);

    // ファイルを取得
    const response = await fetch(fileUrl, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Content-Lengthヘッダーからファイルサイズを確認
    const contentLength = response.headers.get('Content-Length');
    const fileSize = contentLength ? parseInt(contentLength) : 0;

    if (fileSize > maxSize) {
      console.log('ファイルサイズが制限を超過、ネイティブダウンロードにフォールバック');
      return nativeDownloadFile(fileUrl, fileName);
    }

    if (onProgress) onProgress(30);

    // Blobを作成
    const blob = await response.blob();
    console.log('Blob作成完了:', { size: blob.size, type: blob.type });

    if (onProgress) onProgress(70);

    // ダウンロード実行
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // ユーザーアクションとして認識されるよう、即座に実行
    document.body.appendChild(link);
    link.click();
    
    // クリーンアップを遅延実行（ブラウザがダウンロードを開始するまで待機）
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(downloadUrl);
      } catch (cleanupError) {
        console.warn('クリーンアップエラー:', cleanupError);
      }
    }, 100);

    if (onProgress) onProgress(100);
    console.log('Blobダウンロード完了');

    return { success: true };

  } catch (error) {
    console.error('Blobダウンロードエラー:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'ダウンロードがタイムアウトしました' };
    }
    
    // フォールバック処理
    console.log('ネイティブダウンロードにフォールバック');
    return nativeDownloadFile(fileUrl, fileName);
  }
};

/**
 * 直接ダウンロード処理（レガシー関数名、nativeDownloadFileのエイリアス）
 * @param fileUrl ダウンロードするファイルのURL
 * @param fileName 保存時のファイル名
 */
export const directDownload = (fileUrl: string, fileName: string): { success: boolean; error?: string } => {
  return nativeDownloadFile(fileUrl, fileName);
};

/**
 * ファイルサイズを人間が読みやすい形式にフォーマット
 * @param bytes バイト数
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * ブラウザのダウンロード機能サポート状況をチェック
 */
export const checkDownloadSupport = (): {
  downloadAttribute: boolean;
  createObjectUrl: boolean;
  userAgent: string;
} => {
  return {
    downloadAttribute: 'download' in document.createElement('a'),
    createObjectUrl: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
    userAgent: navigator.userAgent
  };
};

/**
 * ダウンロード処理のデバッグ情報を出力
 */
export const logDownloadDebugInfo = (resource: any, error?: Error) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    resource: {
      id: resource.id,
      fileName: resource.file_name,
      fileUrl: resource.file_url,
      fileSize: resource.file_size
    },
    browser: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    },
    support: checkDownloadSupport(),
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null
  };
  
  console.log('ダウンロードデバッグ情報:', debugInfo);
  return debugInfo;
};
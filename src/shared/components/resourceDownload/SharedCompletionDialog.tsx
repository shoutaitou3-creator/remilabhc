import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface SharedCompletionDialogProps {
  isVisible: boolean;
  redirectCountdown: number;
  enableAutoRedirect: boolean;
  onManualRedirect: () => void;
  customTheme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
  };
}

const SharedCompletionDialog: React.FC<SharedCompletionDialogProps> = ({
  isVisible,
  redirectCountdown,
  enableAutoRedirect,
  onManualRedirect,
  customTheme
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          {/* 成功アイコン */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* タイトル */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ダウンロード完了
          </h3>

          {/* メッセージ */}
          <p className="text-gray-600 mb-6">
            すべての資料のダウンロードが完了しました。<br />
            ありがとうございます。
          </p>

          {/* カウントダウンと遷移ボタン */}
          {enableAutoRedirect && redirectCountdown > 0 && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {redirectCountdown}秒後に自動的に遷移します
                </span>
              </div>
            </div>
          )}
          
          {enableAutoRedirect && (
            <button
              onClick={onManualRedirect}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium"
              style={{
                background: customTheme?.colors?.primary 
                  ? `linear-gradient(to right, ${customTheme.colors.primary}, ${customTheme.colors.secondary || customTheme.colors.primary})`
                  : undefined
              }}
            >
              今すぐ遷移する
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedCompletionDialog;
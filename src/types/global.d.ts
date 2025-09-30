// Instagram埋め込みスクリプト用のグローバル型定義
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

export {};
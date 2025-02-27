module.exports = {
  // トップレベルに設定を移動
  reactStrictMode: false,
  // サーバーサイドレンダリング時のエラーを許可する
  onDemandEntries: {
    // ビルド時のエラーを無視
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // rewritesの設定を分離
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dchordapp-back-1.onrender.com/api/:path*', // バックエンドのURLに転送
      },
    ];
  },
};
module.exports = {
  async rewrites() {
    return [
      {//ローカル用
        // source: '/api/:path*',
        // destination: 'http://localhost:8080/api/:path*', // バックエンドのURLに転送
      },
    ];
  },
};
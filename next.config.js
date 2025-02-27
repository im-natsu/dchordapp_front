module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dchordapp-back-1.onrender.com/api/:path*', // バックエンドのURLに転送

        
      },
    ];
  },
};
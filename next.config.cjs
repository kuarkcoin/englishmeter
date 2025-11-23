/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  
  // YÖNLENDİRME MANTIĞI BURAYA EKLENDİ
  async redirects() {
    return [
      {
        // Eski dinamik yolları yakala: /race/1, /race/2, vs.
        source: '/race/:id', 
        // Yeni tek sayfalık SPA'ya gönder
        destination: '/race',
        // Tarayıcı bu değişikliği KESİNLİKLE unutsun diye permanent (kalıcı) yapıyoruz.
        permanent: true, 
      },
    ];
  }
};

module.exports = nextConfig;
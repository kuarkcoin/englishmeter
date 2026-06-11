import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'EnglishMeter AI Flashcards';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #022c22 0%, #047857 55%, #a7f3d0 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial, Helvetica, sans-serif',
          height: '100%',
          justifyContent: 'center',
          padding: '72px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '999px',
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 42,
            padding: '16px 34px',
          }}
        >
          EnglishMeter Flashcards
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          AI Destekli Kelime Kartları
        </div>
        <div
          style={{
            color: '#ecfdf5',
            fontSize: 34,
            lineHeight: 1.35,
            marginTop: 34,
            maxWidth: 920,
          }}
        >
          YDS, YÖKDİL ve IELTS için akademik kelime pratiği.
        </div>
      </div>
    ),
    size,
  );
}

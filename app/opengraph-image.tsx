import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'EnglishMeter – Free English Level & Vocabulary Test';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #38bdf8 100%)',
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
            background: 'rgba(255, 255, 255, 0.16)',
            border: '2px solid rgba(255, 255, 255, 0.28)',
            borderRadius: '999px',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 42,
            padding: '16px 34px',
          }}
        >
          EnglishMeter
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.04,
            maxWidth: 980,
          }}
        >
          Test Your English Level Online
        </div>
        <div
          style={{
            color: '#dbeafe',
            fontSize: 34,
            lineHeight: 1.35,
            marginTop: 34,
            maxWidth: 900,
          }}
        >
          Free CEFR grammar and vocabulary practice for A1–C2 learners.
        </div>
      </div>
    ),
    size,
  );
}

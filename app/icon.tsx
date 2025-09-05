import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#006AF8', // brand primary
          color: '#fff',
          fontSize: 20,
          fontWeight: 800,
          borderRadius: 6,
          letterSpacing: -0.5,
        }}
      >
        O
      </div>
    ),
    size
  );
}


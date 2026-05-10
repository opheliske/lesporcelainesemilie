import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'));

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_600,h_630,g_auto,q_auto,f_auto/oeuvres-emilie/enfants_assiettes/tabluever7khcjo9evut.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0891A8 0%, #05697C 55%, #041C24 100%)',
        }}
      >
        {/* Image à gauche */}
        <div style={{ width: 420, height: 630, flexShrink: 0, position: 'relative', display: 'flex' }}>
          <img
            src={imageUrl}
            width={420}
            height={630}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, transparent 55%, #05697C 100%)',
              display: 'flex',
            }}
          />
        </div>

        {/* Texte à droite */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 72px 60px 48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.5)', display: 'flex' }} />
            <span style={{ fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
              Fait main · France
            </span>
          </div>

          <div style={{ fontSize: 68, fontWeight: 400, lineHeight: 1.05, color: 'white', marginBottom: 24, display: 'flex', flexDirection: 'column' }}>
            <span>Les Porcelaines</span>
            <span style={{ color: 'rgba(255,255,255,0.82)', fontStyle: 'italic' }}>d'Émilie</span>
          </div>

          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontWeight: 400, maxWidth: 380 }}>
            Porcelaines peintes à la main — pièces uniques et commandes personnalisées.
          </div>

          <div style={{ marginTop: 48, fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
            lesporcelainesemilie.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Geist', data: fontData, style: 'normal', weight: 400 }],
    }
  );
}

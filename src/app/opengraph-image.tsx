import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontData = readFileSync(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'));

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const photo = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_900,h_1260,g_auto,q_auto,f_auto/oeuvres-emilie/enfants_assiettes/tabluever7khcjo9evut.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#041C24',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Halo canard décoratif en haut à gauche */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(8,145,168,0.22) 0%, transparent 68%)',
            display: 'flex',
          }}
        />

        {/* Halo secondaire en bas */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: 200,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(8,145,168,0.10) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Panneau texte gauche */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 52px 64px 72px',
            position: 'relative',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 32, height: 2, background: '#0891A8', display: 'flex', borderRadius: 2 }} />
            <span
              style={{
                fontSize: 12,
                letterSpacing: '0.28em',
                color: '#0891A8',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}
            >
              Fait main · France
            </span>
          </div>

          {/* Titre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 32 }}>
            <span
              style={{
                fontSize: 82,
                color: 'white',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.025em',
              }}
            >
              Les Porcelaines
            </span>
            <span
              style={{
                fontSize: 82,
                color: '#0891A8',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
              }}
            >
              d'Émilie
            </span>
          </div>

          {/* Description */}
          <span
            style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.6,
              maxWidth: 340,
              fontWeight: 400,
            }}
          >
            Pièces uniques peintes à la main. Commandes personnalisées pour toutes les occasions.
          </span>

          {/* URL pill */}
          <div style={{ display: 'flex', marginTop: 48 }}>
            <div
              style={{
                background: 'rgba(8,145,168,0.12)',
                border: '1px solid rgba(8,145,168,0.35)',
                borderRadius: 999,
                padding: '9px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891A8', display: 'flex' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
                lesporcelainesdemilie.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Photo droite */}
        <div
          style={{
            width: 420,
            flexShrink: 0,
            padding: '36px 40px 36px 0',
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: 24,
              overflow: 'hidden',
              display: 'flex',
              position: 'relative',
              outline: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <img
              src={photo}
              width={380}
              height={558}
              style={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%' }}
            />
            {/* Vignette légère sur le bord gauche de la photo pour fondre avec le texte */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(4,28,36,0.35) 0%, transparent 35%)',
                display: 'flex',
              }}
            />
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

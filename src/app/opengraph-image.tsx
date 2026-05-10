import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const fontNormal = readFileSync(join(process.cwd(), 'public/fonts/CormorantGaramond-Light.ttf'));
  const fontItalic = readFileSync(join(process.cwd(), 'public/fonts/CormorantGaramond-LightItalic.ttf'));
  const fontGeist  = readFileSync(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'));

  const canard = '#1F5F73';
  const brass  = '#B89160';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: canard,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Halos radiaux décoratifs */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 20% 30%, rgba(184,145,96,0.10) 0%, transparent 50%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 60%)',
          display: 'flex',
        }} />

        {/* Anneau décoratif haut-droite */}
        <div style={{
          position: 'absolute',
          width: 460, height: 460,
          borderRadius: '50%',
          border: '1px solid rgba(184,145,96,0.22)',
          right: -120, top: -120,
          display: 'flex',
        }} />

        {/* Anneau décoratif bas-gauche */}
        <div style={{
          position: 'absolute',
          width: 320, height: 320,
          borderRadius: '50%',
          border: '1px solid rgba(184,145,96,0.18)',
          left: -80, bottom: -80,
          display: 'flex',
        }} />

        {/* Eyebrow — "Maison · Atelier français" avec lignes laiton */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 38,
          zIndex: 1,
        }}>
          <div style={{ width: 40, height: 1, background: brass, display: 'flex' }} />
          <span style={{
            fontFamily: 'Geist',
            fontSize: 13,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: brass,
            fontWeight: 400,
          }}>
            Maison · Atelier français
          </span>
          <div style={{ width: 40, height: 1, background: brass, display: 'flex' }} />
        </div>

        {/* Titre */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 28,
          zIndex: 1,
          gap: 0,
        }}>
          <span style={{
            fontFamily: 'Cormorant',
            fontSize: 124,
            lineHeight: 0.98,
            fontWeight: 300,
            color: 'white',
            letterSpacing: '-0.025em',
            textAlign: 'center',
          }}>
            Les Porcelaines
          </span>
          <span style={{
            fontFamily: 'CormorantItalic',
            fontSize: 124,
            lineHeight: 1,
            fontWeight: 300,
            color: brass,
            letterSpacing: '-0.025em',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            d'Émilie
          </span>
        </div>

        {/* Séparateur laiton */}
        <div style={{
          width: 60, height: 1,
          background: brass,
          marginBottom: 28,
          zIndex: 1,
          display: 'flex',
        }} />

        {/* Tagline */}
        <div style={{
          display: 'flex',
          fontFamily: 'CormorantItalic',
          fontStyle: 'italic',
          fontSize: 26,
          color: 'rgba(255,255,255,0.82)',
          textAlign: 'center',
          lineHeight: 1.4,
          fontWeight: 300,
          zIndex: 1,
        }}>
          Porcelaines peintes à la main — pièces uniques et commandes personnalisées
        </div>

        {/* URL */}
        <div style={{
          display: 'flex',
          position: 'absolute',
          bottom: 40,
          fontFamily: 'Geist',
          fontSize: 12,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 400,
          zIndex: 1,
        }}>
          lesporcelainesdemilie.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant',       data: fontNormal, style: 'normal', weight: 300 },
        { name: 'CormorantItalic', data: fontItalic, style: 'italic', weight: 300 },
        { name: 'Geist',           data: fontGeist,  style: 'normal', weight: 400 },
      ],
    }
  );
}

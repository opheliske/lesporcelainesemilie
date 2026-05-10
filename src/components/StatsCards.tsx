'use client';

import { useEffect, useState } from 'react';
import type { Oeuvre } from '@/types/oeuvre';
import { CATEGORIE_LABELS, THEME_LABELS } from '@/lib/constants';

interface Stats {
  total: number;
  topCategorie: string;
  topTheme: string;
  thisWeek: number;
}

function top(oeuvres: Oeuvre[], key: 'categorie' | 'theme'): string {
  const counts: Record<string, number> = {};
  for (const o of oeuvres) counts[o[key]] = (counts[o[key]] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
}

function computeStats(oeuvres: Oeuvre[]): Stats {
  const total = oeuvres.length;
  const topCategorie = CATEGORIE_LABELS[top(oeuvres, 'categorie') as keyof typeof CATEGORIE_LABELS] ?? '—';
  const topTheme = THEME_LABELS[top(oeuvres, 'theme') as keyof typeof THEME_LABELS] ?? '—';
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = oeuvres.filter((o) => o.createdAt && new Date(o.createdAt) >= weekAgo).length;
  return { total, topCategorie, topTheme, thisWeek };
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/oeuvres')
      .then((r) => r.json())
      .then((data: Oeuvre[]) => setStats(computeStats(data)));
  }, []);

  const cards = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      label: 'Œuvres au total',
      value: stats ? String(stats.total) : '—',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      label: 'Catégorie la plus représentée',
      value: stats ? stats.topCategorie : '—',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
      label: 'Thème le plus représenté',
      value: stats ? stats.topTheme : '—',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      label: 'Ajoutées cette semaine',
      value: stats ? String(stats.thisWeek) : '—',
    },
  ];

  return (
    <div className="stats-row">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

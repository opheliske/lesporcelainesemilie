'use client';

import { useEffect, useState } from 'react';
import type { Oeuvre } from '@/types/oeuvre';
import { CATEGORIE_LABELS } from '@/lib/constants';

interface Stats {
  total: number;
  topCategorie: string;
  thisWeek: number;
}

function computeStats(oeuvres: Oeuvre[]): Stats {
  const total = oeuvres.length;

  const counts: Record<string, number> = {};
  for (const o of oeuvres) counts[o.categorie] = (counts[o.categorie] || 0) + 1;
  const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  const topCategorie = CATEGORIE_LABELS[topKey as keyof typeof CATEGORIE_LABELS] ?? topKey;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeek = oeuvres.filter((o) => o.createdAt && new Date(o.createdAt) >= weekAgo).length;

  return { total, topCategorie, thisWeek };
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      label: 'Catégorie la plus représentée',
      value: stats ? stats.topCategorie : '—',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
          <div className="stat-value">{c.value}</div>
          <div className="stat-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

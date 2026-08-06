import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Trees, Coffee, Music } from 'lucide-react';

export interface SoundTrack {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const SoundscapePlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(70);

  const tracks: SoundTrack[] = [
    { id: 'rain', name: 'Rainfall', icon: <CloudRain size={20} /> },
    { id: 'forest', name: 'Pine Forest', icon: <Trees size={20} /> },
    { id: 'cafe', name: 'Cozy Cafe', icon: <Coffee size={20} /> },
    { id: 'lofi', name: 'Lofi Beats', icon: <Music size={20} /> },
  ];

  const toggleTrack = (id: string) => {
    setActiveTrack((prev) => (prev === id ? null : id));
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }} role="region" aria-label="Ambient Soundscape Player">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Ambient Soundscapes</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeTrack ? <Volume2 size={18} color="#a855f7" /> : <VolumeX size={18} color="#64748b" />}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '80px', accentColor: '#a855f7' }}
            aria-label="Soundscape Volume"
          />
        </div>
      </div>

      <div className="sound-grid">
        {tracks.map((t) => (
          <div
            key={t.id}
            className={`sound-card ${activeTrack === t.id ? 'active' : ''}`}
            onClick={() => toggleTrack(t.id)}
            role="button"
            aria-pressed={activeTrack === t.id}
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: activeTrack === t.id ? '#a855f7' : '#94a3b8' }}>{t.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.name}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: activeTrack === t.id ? '#a855f7' : '#64748b' }}>
              {activeTrack === t.id ? 'Playing' : 'Off'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

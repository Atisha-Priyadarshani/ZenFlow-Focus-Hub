import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Trees, Coffee, Music } from 'lucide-react';

export interface SoundTrack {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const SoundscapePlayer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(70);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ source: AudioNode; gain: GainNode } | null>(null);

  const tracks: SoundTrack[] = [
    { id: 'rain', name: 'Rainfall', icon: <CloudRain size={20} /> },
    { id: 'forest', name: 'Pine Forest', icon: <Trees size={20} /> },
    { id: 'cafe', name: 'Cozy Cafe', icon: <Coffee size={20} /> },
    { id: 'lofi', name: 'Lofi Ambient', icon: <Music size={20} /> },
  ];

  // Stop currently playing Web Audio nodes
  const stopAudio = () => {
    if (activeNodesRef.current) {
      try {
        activeNodesRef.current.gain.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);
        if ('stop' in activeNodesRef.current.source) {
          (activeNodesRef.current.source as AudioBufferSourceNode | OscillatorNode).stop();
        }
      } catch (e) {
        // ignore cleanup errors
      }
      activeNodesRef.current = null;
    }
  };

  // Web Audio API ambient audio synthesizer
  const playSoundscape = (type: string) => {
    stopAudio();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume / 100, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (type === 'rain') {
      // Synthesize soothing rain noise using pink noise buffer & lowpass filter
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      activeNodesRef.current = { source: whiteNoise, gain: masterGain };
    } else if (type === 'forest' || type === 'lofi' || type === 'cafe') {
      // Synthesize ambient binaural drone oscillator with gentle modulation
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = type === 'lofi' ? 'sine' : type === 'forest' ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(type === 'lofi' ? 174 : type === 'forest' ? 216 : 140, ctx.currentTime);

      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);

      lfo.connect(osc.frequency);
      osc.connect(masterGain);

      lfo.start();
      osc.start();

      activeNodesRef.current = { source: osc, gain: masterGain };
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (activeNodesRef.current && audioCtxRef.current) {
      activeNodesRef.current.gain.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const toggleTrack = (id: string) => {
    if (activeTrack === id) {
      stopAudio();
      setActiveTrack(null);
    } else {
      setActiveTrack(id);
      playSoundscape(id);
    }
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }} role="region" aria-label="Ambient Soundscape Player">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>Real Ambient Soundscapes</h3>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Web Audio Synthesizer Engine</span>
        </div>
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
            <span style={{ fontSize: '0.75rem', color: activeTrack === t.id ? '#a855f7' : '#64748b', fontWeight: 600 }}>
              {activeTrack === t.id ? '🔊 Playing' : 'Off'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

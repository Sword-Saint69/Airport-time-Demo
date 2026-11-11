/**
 * A tiny generative lo-fi engine.
 *
 * It is deliberately minimal: a warm three-voice chord pad with a slow
 * filter sweep, plus a filtered noise bed for the vinyl hiss. Each track is
 * a chord progression; the engine cross-fades between chords and between
 * tracks.
 *
 * Everything is wrapped so that a browser without Web Audio (or a blocked
 * context) simply does nothing — the UI must never break because of audio.
 */

export interface LoFiTrack {
  /** Track title shown in the player card. */
  title: string;
  /** Track subtitle shown in the player card. */
  artist: string;
  /** Chord progression; each chord is a list of MIDI note numbers. */
  progression: number[][];
  /** How long each chord lasts, in seconds. */
  chordSeconds: number;
}

/** MIDI note number -> frequency in Hz. */
function midiToFreq(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export const LOFI_TRACKS: LoFiTrack[] = [
  {
    title: "Nocturnal Window",
    artist: "Lofi Music",
    // Fmaj9 - Dm9 - Am7 - G13
    progression: [
      [53, 57, 60, 64, 67],
      [50, 53, 57, 64, 65],
      [45, 60, 64, 67, 69],
      [43, 53, 59, 64, 67],
    ],
    chordSeconds: 4.2,
  },
  {
    title: "Midnight Rain",
    artist: "Lofi Music",
    // Am7 - Fmaj9 - Cmaj7 - G13
    progression: [
      [45, 60, 64, 67, 71],
      [53, 57, 60, 64, 67],
      [48, 52, 55, 59, 64],
      [43, 53, 59, 64, 67],
    ],
    chordSeconds: 4.6,
  },
  {
    title: "Slow Orbit",
    artist: "Lofi Music",
    // Dm9 - G13 - Fmaj9 - Am7
    progression: [
      [50, 53, 57, 64, 65],
      [43, 53, 59, 64, 67],
      [53, 57, 60, 64, 67],
      [45, 60, 64, 67, 69],
    ],
    chordSeconds: 4.0,
  },
];

export interface LoFiState {
  playing: boolean;
  trackIndex: number;
  shuffle: boolean;
  /** 0..1 */
  volume: number;
}

type Listener = (state: LoFiState) => void;

export class LoFiEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private voice: { gain: GainNode; oscillators: OscillatorNode[] } | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<Listener>();
  private chordIndex = 0;

  private state: LoFiState = {
    playing: false,
    trackIndex: 0,
    shuffle: false,
    volume: 0.6,
  };

  /** Subscribe to engine state changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): LoFiState {
    return this.state;
  }

  private emit(patch: Partial<LoFiState>) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  private ensureContext(): boolean {
    if (typeof window === "undefined") return false;

    try {
      if (!this.ctx) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) return false;

        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.state.volume * 0.5;
        this.master.connect(this.ctx.destination);

        this.musicBus = this.ctx.createGain();
        this.musicBus.gain.value = 1;
        this.musicBus.connect(this.master);

        this.startNoiseBed();
      }

      if (this.ctx.state === "suspended") {
        const resumed = this.ctx.resume();
        if (resumed && typeof resumed.catch === "function") {
          void resumed.catch(() => {});
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  /** A soft, slowly-filtered noise bed — the "vinyl" underneath the pad. */
  private startNoiseBed() {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;

    const length = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let last = 0;
    for (let i = 0; i < length; i += 1) {
      // Brown-ish noise: integrates white noise, so it sits low in the mix.
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 780;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0.1;

    // Slow wobble on the cutoff so the bed breathes.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(filter.frequency);

    source.connect(filter).connect(gain).connect(bus);
    source.start();
    lfo.start();

    this.noiseGain = gain;
  }

  /** Cross-fade to a new chord. */
  private playChord(chord: number[]) {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;

    const now = ctx.currentTime;
    const previous = this.voice;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 1.1);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(520, now);
    filter.frequency.linearRampToValueAtTime(1150, now + 2.4);
    filter.frequency.linearRampToValueAtTime(700, now + 5.2);
    filter.Q.value = 0.5;

    gain.connect(filter).connect(bus);

    const oscillators: OscillatorNode[] = [];
    const types: OscillatorType[] = ["triangle", "sine", "sine"];

    chord.forEach((note, i) => {
      const osc = ctx.createOscillator();
      osc.type = types[i % types.length];
      osc.frequency.value = midiToFreq(note);
      // Slight detune per voice keeps the pad from sounding synthetic.
      osc.detune.value = (i - 1) * 4;

      const voiceGain = ctx.createGain();
      voiceGain.gain.value = i === 0 ? 0.5 : 0.32;

      osc.connect(voiceGain).connect(gain);
      osc.start(now);
      oscillators.push(osc);
    });

    this.voice = { gain, oscillators };

    if (previous) {
      try {
        previous.gain.gain.cancelScheduledValues(now);
        previous.gain.gain.setValueAtTime(
          Math.max(previous.gain.gain.value, 0.0001),
          now,
        );
        previous.gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
        for (const osc of previous.oscillators) osc.stop(now + 1.1);
      } catch {
        /* already stopped */
      }
    }
  }

  private scheduleNext() {
    if (this.timer !== null) clearTimeout(this.timer);

    const track = LOFI_TRACKS[this.state.trackIndex];
    if (!track) return;

    this.playChord(track.progression[this.chordIndex % track.progression.length]);
    this.chordIndex += 1;

    this.timer = setTimeout(() => {
      if (this.state.playing) this.scheduleNext();
    }, track.chordSeconds * 1000);
  }

  play() {
    if (!this.ensureContext()) return;
    if (this.state.playing) return;

    this.chordIndex = 0;
    this.emit({ playing: true });
    this.scheduleNext();
  }

  pause() {
    if (!this.state.playing) return;

    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const ctx = this.ctx;
    const now = ctx?.currentTime ?? 0;
    if (ctx && this.voice) {
      try {
        this.voice.gain.gain.cancelScheduledValues(now);
        this.voice.gain.gain.setValueAtTime(
          Math.max(this.voice.gain.gain.value, 0.0001),
          now,
        );
        this.voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        for (const osc of this.voice.oscillators) osc.stop(now + 0.7);
      } catch {
        /* already stopped */
      }
      this.voice = null;
    }

    this.emit({ playing: false });
  }

  toggle() {
    if (this.state.playing) this.pause();
    else this.play();
  }

  /** Jump to a track by index. */
  selectTrack(index: number) {
    const next = ((index % LOFI_TRACKS.length) + LOFI_TRACKS.length) % LOFI_TRACKS.length;
    this.chordIndex = 0;
    this.emit({ trackIndex: next });
    if (this.state.playing) this.scheduleNext();
  }

  next() {
    if (this.state.shuffle) {
      let pick = this.state.trackIndex;
      while (pick === this.state.trackIndex && LOFI_TRACKS.length > 1) {
        pick = Math.floor(Math.random() * LOFI_TRACKS.length);
      }
      this.selectTrack(pick);
      return;
    }
    this.selectTrack(this.state.trackIndex + 1);
  }

  previous() {
    if (this.state.shuffle) {
      this.selectTrack(Math.floor(Math.random() * LOFI_TRACKS.length));
      return;
    }
    this.selectTrack(this.state.trackIndex - 1);
  }

  toggleShuffle() {
    this.emit({ shuffle: !this.state.shuffle });
  }

  /** Set the music volume, 0..1. */
  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.emit({ volume: clamped });
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        clamped * 0.5,
        this.ctx.currentTime,
        0.08,
      );
    }
  }

  /** Release the audio hardware. */
  dispose() {
    this.pause();
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    try {
      const closed = this.ctx?.close();
      if (closed && typeof closed.catch === "function") void closed.catch(() => {});
    } catch {
      /* nothing to do */
    }
    this.ctx = null;
    this.master = null;
    this.musicBus = null;
    this.voice = null;
  }
}

"use client";

/**
 * The music player.
 *
 * The board plays a real track — an MP3 served from `public/audio` — rather
 * than synthesising one. An `<audio>` element is used rather than the Web
 * Audio API: it streams, it decodes off the main thread, and the browser
 * handles the gapless looping for us.
 *
 * Everything is wrapped so that a browser without media support (or a
 * blocked autoplay policy) simply does nothing — the UI must never break
 * because of audio.
 */

export interface Track {
  /** Track id, used as a stable React key. */
  id: string;
  /** Track title shown in the player card. */
  title: string;
  /** Track subtitle shown in the player card. */
  artist: string;
  /** Path to the audio file, relative to the site root. */
  src: string;
}

export const TRACKS: Track[] = [
  {
    id: "spotlight",
    title: "Spotlight",
    artist: "Co.",
    src: "/audio/spotlight.mp3",
  },
];

export interface MusicState {
  playing: boolean;
  trackIndex: number;
  shuffle: boolean;
  /** 0..1 */
  volume: number;
  /** The current playback position, in seconds. */
  position: number;
  /** The length of the track, in seconds. */
  duration: number;
}

type Listener = (state: MusicState) => void;

export class MusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private raf = 0;

  private state: MusicState = {
    playing: false,
    trackIndex: 0,
    shuffle: false,
    volume: 0.6,
    position: 0,
    duration: 0,
  };

  /**
   * Create the media element up front.
   *
   * Building it eagerly lets the browser fetch the metadata straight away,
   * so the scrubber knows the track's length before anything is played.
   */
  constructor() {
    this.element();
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): MusicState {
    return this.state;
  }

  private emit(patch: Partial<MusicState>) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener(this.state);
  }

  /** The audio element, created on first use. */
  private element(): HTMLAudioElement | null {
    if (typeof document === "undefined") return null;
    if (this.audio) return this.audio;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = this.state.volume;
    audio.crossOrigin = "anonymous";
    // Attach it to the document: a detached media element works, but the
    // browser's media controls and devtools cannot see it, and some
    // autoplay heuristics are stricter about detached elements.
    audio.setAttribute("data-world-time-audio", "");
    audio.style.display = "none";
    document.body.appendChild(audio);

    const track = TRACKS[this.state.trackIndex];
    if (track) audio.src = track.src;

    audio.addEventListener("loadedmetadata", () => {
      this.emit({ duration: audio.duration });
    });

    audio.addEventListener("ended", () => {
      // The track loops, but a manual end should still advance the state.
      this.emit({ position: 0 });
    });

    audio.addEventListener("play", () => this.emit({ playing: true }));
    audio.addEventListener("pause", () => this.emit({ playing: false }));

    audio.addEventListener("error", () => {
      // A missing or undecodable file must not break the UI.
      this.emit({ playing: false });
    });

    this.audio = audio;
    return audio;
  }

  /**
   * Poll the playback position.
   *
   * The `timeupdate` event only fires about four times a second, which is
   * too coarse for a smooth progress bar, so the position is read on every
   * animation frame instead.
   *
   * It is only *published* when the whole second changes, though: the
   * position lives in the app's React state, and re-rendering the whole
   * studio sixty times a second to move a scrubber would be absurd.
   */
  private startTicking() {
    if (this.raf !== 0) return;
    let lastPublished = -1;
    const tick = () => {
      const audio = this.audio;
      if (audio && this.state.playing) {
        const second = Math.floor(audio.currentTime);
        if (second !== lastPublished) {
          lastPublished = second;
          this.emit({ position: audio.currentTime, duration: audio.duration });
        }
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stopTicking() {
    if (this.raf !== 0) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  play() {
    const audio = this.element();
    if (!audio) return;
    if (this.state.playing) return;

    // A rejected play() is normal when the browser blocks autoplay.
    const result = audio.play();
    if (result && typeof result.catch === "function") {
      void result.catch(() => {
        this.emit({ playing: false });
      });
    }

    this.emit({ playing: true });
    this.startTicking();
  }

  pause() {
    const audio = this.audio;
    if (audio) audio.pause();
    this.emit({ playing: false });
    this.stopTicking();
  }

  toggle() {
    if (this.state.playing) this.pause();
    else this.play();
  }

  /** Jump to a track by index. */
  selectTrack(index: number) {
    const next =
      ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    const track = TRACKS[next];
    if (!track) return;

    const wasPlaying = this.state.playing;
    const audio = this.element();
    if (audio) {
      audio.src = track.src;
      audio.load();
    }
    this.emit({ trackIndex: next, position: 0 });
    if (wasPlaying) this.play();
  }

  next() {
    if (this.state.shuffle && TRACKS.length > 1) {
      let pick = this.state.trackIndex;
      while (pick === this.state.trackIndex) {
        pick = Math.floor(Math.random() * TRACKS.length);
      }
      this.selectTrack(pick);
      return;
    }
    this.selectTrack(this.state.trackIndex + 1);
  }

  previous() {
    // Restarting the track is what a listener expects from "previous" when
    // there is only one track in the queue.
    if (TRACKS.length === 1) {
      this.seek(0);
      return;
    }
    if (this.state.shuffle) {
      this.selectTrack(Math.floor(Math.random() * TRACKS.length));
      return;
    }
    this.selectTrack(this.state.trackIndex - 1);
  }

  toggleShuffle() {
    this.emit({ shuffle: !this.state.shuffle });
  }

  /** Seek to a position, in seconds. */
  seek(seconds: number) {
    const audio = this.audio;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(seconds, audio.duration || 0));
    audio.currentTime = clamped;
    this.emit({ position: clamped });
  }

  /** Set the music volume, 0..1. */
  setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.emit({ volume: clamped });
    if (this.audio) this.audio.volume = clamped;
  }

  /** Release the media element. */
  dispose() {
    this.pause();
    this.stopTicking();
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.audio.remove();
      this.audio = null;
    }
    this.listeners.clear();
  }
}

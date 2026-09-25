import { useCallback, useEffect, useRef, useState } from "react";

const STEPS = 16;
type Track = "kick" | "hat" | "tone";
type Pattern = Record<Track, boolean[]>;

const initialPattern = (): Pattern => ({
  kick: [true, false, false, false, true, false, false, false, true, false, false, true, true, false, false, false],
  hat: [false, false, true, false, false, false, true, false, false, false, true, false, false, true, true, false],
  tone: [true, false, false, true, false, false, true, false, true, false, false, false, true, false, true, false],
});

const SignalLab = () => {
  const [pattern, setPattern] = useState<Pattern>(initialPattern);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [tempo, setTempo] = useState(112);
  const [swing, setSwing] = useState(18);
  const [volume, setVolume] = useState(24);
  const [scheduled, setScheduled] = useState(0);
  const [audioState, setAudioState] = useState("standby");

  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const uiTimersRef = useRef<number[]>([]);
  const nextStepRef = useRef(0);
  const nextTimeRef = useRef(0);
  const patternRef = useRef(pattern);
  const tempoRef = useRef(tempo);
  const swingRef = useRef(swing);
  const volumeRef = useRef(volume);

  useEffect(() => { patternRef.current = pattern; }, [pattern]);
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { swingRef.current = swing; }, [swing]);
  useEffect(() => {
    volumeRef.current = volume;
    if (masterRef.current) masterRef.current.gain.setTargetAtTime(volume / 100, masterRef.current.context.currentTime, 0.02);
  }, [volume]);

  const triggerKick = (context: AudioContext, destination: AudioNode, time: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(145, time);
    oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.12);
    gain.gain.setValueAtTime(0.86, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.19);
    oscillator.connect(gain).connect(destination);
    oscillator.start(time);
    oscillator.stop(time + 0.2);
  };

  const triggerHat = (context: AudioContext, destination: AudioNode, time: number) => {
    const length = Math.floor(context.sampleRate * 0.045);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = 6200;
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
    source.connect(filter).connect(gain).connect(destination);
    source.start(time);
  };

  const triggerTone = (context: AudioContext, destination: AudioNode, time: number, step: number) => {
    const notes = [110, 146.83, 164.81, 196, 220, 196, 164.81, 146.83];
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(notes[step % notes.length], time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100, time);
    filter.frequency.exponentialRampToValueAtTime(280, time + 0.15);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    oscillator.connect(filter).connect(gain).connect(destination);
    oscillator.start(time);
    oscillator.stop(time + 0.2);
  };

  const scheduleStep = useCallback((step: number, time: number) => {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!context || !master) return;
    const activePattern = patternRef.current;
    if (activePattern.kick[step]) triggerKick(context, master, time);
    if (activePattern.hat[step]) triggerHat(context, master, time);
    if (activePattern.tone[step]) triggerTone(context, master, time, step);

    const wait = Math.max(0, (time - context.currentTime) * 1000);
    const timer = window.setTimeout(() => setCurrentStep(step), wait);
    uiTimersRef.current.push(timer);
    setScheduled((value) => value + 1);
  }, []);

  const stop = useCallback(() => {
    if (schedulerRef.current !== null) window.clearInterval(schedulerRef.current);
    schedulerRef.current = null;
    uiTimersRef.current.forEach(window.clearTimeout);
    uiTimersRef.current = [];
    setPlaying(false);
    setCurrentStep(-1);
    setAudioState("paused");
  }, []);

  const start = async () => {
    let context = contextRef.current;
    if (!context) {
      context = new AudioContext();
      const master = context.createGain();
      const compressor = context.createDynamicsCompressor();
      master.gain.value = volumeRef.current / 100;
      compressor.threshold.value = -18;
      compressor.knee.value = 16;
      compressor.ratio.value = 6;
      master.connect(compressor).connect(context.destination);
      contextRef.current = context;
      masterRef.current = master;
    }
    await context.resume();
    nextStepRef.current = currentStep >= 0 ? (currentStep + 1) % STEPS : 0;
    nextTimeRef.current = context.currentTime + 0.055;
    setPlaying(true);
    setAudioState("audio live");

    const scheduler = () => {
      const activeContext = contextRef.current;
      if (!activeContext) return;
      while (nextTimeRef.current < activeContext.currentTime + 0.12) {
        const step = nextStepRef.current;
        const stepDuration = (60 / tempoRef.current) / 4;
        const swingOffset = step % 2 === 1 ? stepDuration * (swingRef.current / 100) * 0.55 : 0;
        scheduleStep(step, nextTimeRef.current + swingOffset);
        nextTimeRef.current += stepDuration;
        nextStepRef.current = (step + 1) % STEPS;
      }
    };
    scheduler();
    schedulerRef.current = window.setInterval(scheduler, 25);
  };

  useEffect(() => () => {
    if (schedulerRef.current !== null) window.clearInterval(schedulerRef.current);
    uiTimersRef.current.forEach(window.clearTimeout);
    void contextRef.current?.close();
  }, []);

  const toggleStep = (track: Track, step: number) => {
    setPattern((current) => ({ ...current, [track]: current[track].map((on, index) => index === step ? !on : on) }));
  };

  const randomize = () => {
    setPattern({
      kick: Array.from({ length: STEPS }, (_, index) => index % 4 === 0 || Math.random() > 0.88),
      hat: Array.from({ length: STEPS }, (_, index) => index % 4 === 2 || Math.random() > 0.76),
      tone: Array.from({ length: STEPS }, () => Math.random() > 0.66),
    });
  };

  const clear = () => setPattern({ kick: Array(STEPS).fill(false), hat: Array(STEPS).fill(false), tone: Array(STEPS).fill(false) });

  return (
    <div className="kz-lab-layout kz-signal-layout">
      <div className="kz-lab-stage">
        <div className="kz-lab-stage__bar">
          <span>AUDIO CLOCK / 16 STEPS</span>
          <span className={`kz-lab-status ${playing ? "is-found" : "is-ready"}`}><i />{audioState}</span>
        </div>

        <div className="kz-signal-scope" aria-hidden>
          {Array.from({ length: STEPS }, (_, step) => {
            const voices = (pattern.kick[step] ? 1 : 0) + (pattern.hat[step] ? 1 : 0) + (pattern.tone[step] ? 1 : 0);
            return <i key={step} className={currentStep === step ? "is-current" : ""} style={{ height: `${16 + voices * 22 + ((step * 13) % 17)}%` }} />;
          })}
          <span>OUTPUT / STEREO</span><b>{tempo} BPM</b>
        </div>

        <div className="kz-sequencer" role="grid" aria-label="Sixteen-step audio sequencer">
          <div className="kz-sequencer__numbers"><span />{Array.from({ length: STEPS }, (_, step) => <i key={step} className={currentStep === step ? "is-current" : ""}>{String(step + 1).padStart(2, "0")}</i>)}</div>
          {(["kick", "hat", "tone"] as Track[]).map((track) => (
            <div className="kz-sequencer__row" key={track}>
              <span><b>{track}</b><small>{track === "kick" ? "SUB" : track === "hat" ? "NOISE" : "OSC"}</small></span>
              {pattern[track].map((on, step) => (
                <button
                  type="button"
                  key={step}
                  aria-label={`${track}, step ${step + 1}, ${on ? "active" : "inactive"}`}
                  aria-pressed={on}
                  className={`${on ? "is-on" : ""}${currentStep === step ? " is-current" : ""}`}
                  onClick={() => toggleStep(track, step)}
                ><i /></button>
              ))}
            </div>
          ))}
        </div>

        <div className="kz-lab-legend">
          <span><i className="is-route" />Active trigger</span>
          <span><i className="is-frontier" />Playhead</span>
          <span><i className="is-vector" />Web Audio clock</span>
        </div>
      </div>

      <aside className="kz-lab-controls">
        <div className="kz-control-copy">
          <strong>Program a signal.</strong>
          <p>Toggle steps to write a pattern. A look-ahead scheduler places every voice directly on the browser audio clock so timing stays stable.</p>
        </div>

        <div className="kz-signal-ranges">
          <label><span className="kz-range-heading"><span className="kz-control-label">Tempo</span><output>{tempo} bpm</output></span><input className="kz-range" type="range" min="72" max="156" value={tempo} onChange={(event) => setTempo(Number(event.target.value))} /></label>
          <label><span className="kz-range-heading"><span className="kz-control-label">Swing</span><output>{swing}%</output></span><input className="kz-range" type="range" min="0" max="48" value={swing} onChange={(event) => setSwing(Number(event.target.value))} /></label>
          <label><span className="kz-range-heading"><span className="kz-control-label">Output</span><output>{volume}%</output></span><input className="kz-range" type="range" min="0" max="48" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
        </div>

        <dl className="kz-lab-metrics">
          <div><dt>Scheduler</dt><dd>25 ms</dd></div>
          <div><dt>Look-ahead</dt><dd>120 ms</dd></div>
          <div><dt>Steps queued</dt><dd>{scheduled.toString().padStart(4, "0")}</dd></div>
        </dl>

        <div className="kz-control-actions">
          <button type="button" className="is-primary" onClick={playing ? stop : start}>{playing ? "Stop sequence" : "Play sequence"} <span>{playing ? "■" : "▶"}</span></button>
          <button type="button" onClick={randomize}>Generate pattern</button>
          <button type="button" onClick={clear}>Clear pattern</button>
        </div>
      </aside>
    </div>
  );
};

export default SignalLab;

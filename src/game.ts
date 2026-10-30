import { hsbToRgb } from './color.ts';
import type { ColorHSB } from './color.ts';
import { getScoreLabel, roundScore, similarity } from './score.ts';

export type GameState = 'idle' | 'showing' | 'guessing' | 'result';
export type GameResult = {
  score: number;
  label: string;
};

export type GameSnapshot = {
  state: GameState;
  target: ColorHSB | null;
  guess: ColorHSB;
  remainingMs: number;
  result: GameResult | null;
};

export type Game = {
  start: () => void;
  setGuess: (change: Partial<ColorHSB>) => void;
  submit: () => void;
  playAgain: () => void;
  getSnapshot: () => GameSnapshot;
};
export const showDurationMs = 10000; //waktu mengingat = 10 detik
export const defaultGuess: ColorHSB = { hue: 180, saturation: 50, brightness: 50 }; //slidebar dibawah angka detik

const tickMs = 100; 

export function generateTargetColor(): ColorHSB {
  return {
    hue: Math.random() * 360,
    saturation: 40 + Math.random() * 60,
    brightness: 40 + Math.random() * 60,
  };
}

export function createGame(
  onChange: () => void,
  durationMs: number = showDurationMs,
): Game {
  let state: GameState = 'idle';
  let target: ColorHSB | null = null;
  let guess: ColorHSB = { ...defaultGuess };
  let result: GameResult | null = null;
  let remainingMs = durationMs;
  let showStartedAt = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;

  function stopTimer(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function tick(): void {
    remainingMs = Math.max(0, durationMs - (Date.now() - showStartedAt));
    if (remainingMs <= 0) {
      goTo('guessing');
    } else {
      onChange();
    }
  }

  function goTo(nextState: GameState): void {
    stopTimer();
    state = nextState;

    if (nextState === 'showing') {
      target = generateTargetColor();
      guess = { ...defaultGuess };
      result = null;
      remainingMs = durationMs;
      showStartedAt = Date.now();
      timerId = setInterval(tick, tickMs);
    }
    onChange();
  }

  function start(): void {
    if (state === 'idle') {
      goTo('showing');
    }
  }

  function setGuess(change: Partial<ColorHSB>): void {
    if (state !== 'guessing') {
      return;
    }
    guess = { ...guess, ...change };
    onChange();
  }

  function submit(): void {
    if (state !== 'guessing' || target === null) {
      return;
    }
    const rawScore = similarity(hsbToRgb(target), hsbToRgb(guess));
    result = { score: roundScore(rawScore), label: getScoreLabel(rawScore) };
    goTo('result');
  }

  function playAgain(): void {
    if (state === 'result') {
      goTo('showing');
    }
  }

  function getSnapshot(): GameSnapshot {
    return {
      state,
      target: target === null ? null : { ...target },
      guess: { ...guess },
      remainingMs,
      result: result === null ? null : { ...result },
    };
  }
  return { start, setGuess, submit, playAgain, getSnapshot };
}
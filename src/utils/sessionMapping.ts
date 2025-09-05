export type MoodCode = 'better' | 'same' | 'worse';
export type SessionAnswer = 'Bra' | 'Okej' | 'Dåligt';

export const moodToAnswer: Record<MoodCode, SessionAnswer> = {
  better: 'Bra',
  same: 'Okej',
  worse: 'Dåligt',
};

export const answerToMood: Partial<Record<SessionAnswer, MoodCode>> = {
  Bra: 'better',
  Okej: 'same',
  Dåligt: 'worse',
};

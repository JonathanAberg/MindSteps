export type SessionProps = {
  steps: number;
  answer: string;
  date: string;
};

export type HistorySession = {
  _id: string;
  steps: number;
  time: number;
  answer: 'Bra' | 'Okej' | 'Dåligt';
  date: string;
  mood?: number;
  reflection?: string;
};

export type CreateSessionProps = {
  time: number;
  steps: number;
  answer: 'Bra' | 'Okej' | 'Dåligt';
  deviceId: string;
  date?: string;
  mood?: number;
  reflection?: string;
};

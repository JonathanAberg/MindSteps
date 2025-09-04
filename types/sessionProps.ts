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
};

export type CreateSessionProps = {
  time: number; // duration i sekunder
  steps: number;
  answer: 'Bra' | 'Okej' | 'Dåligt';
  deviceId: string;
};

export type SessionProps = {
  steps: number;
  answer: string;
  date: string;
}



export type HistorySession = {
  _id: string;
  steps: number;
  time: string;
  answer: string;
  date: string;
};

export type CreateSessionProps = {
  time: string;
  steps: number;
  answer: string;
  deviceId: string;
}
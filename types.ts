export interface Word {
  id: string;
  term: string;
  definition: string;
  lesson: 1 | 5;
}

export enum Tab {
  LIST = 'Lijst',
  FLASHCARDS = 'Oefenen',
  QUIZ = 'Quiz',
  CHAT = 'Vraag de Mol',
  IMAGE = 'Plaatjesmaker'
}
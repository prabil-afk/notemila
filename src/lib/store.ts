import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type CardType = 'text' | 'image' | 'link' | 'todo';

export interface ImageData {
  url: string;
  type: 'upload' | 'external';
  description?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  type: CardType;
  content: string;
  position: { x: number; y: number };
  imageData?: ImageData;
  todoItems?: TodoItem[];
}

interface BoardState {
  cards: Card[];
  addCard: (type: CardType, position: { x: number; y: number }) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  updateCardPosition: (id: string, position: { x: number; y: number }) => void;
}

export const useBoard = create<BoardState>((set) => ({
  cards: [],
  addCard: (type, position) =>
    set((state) => ({
      cards: [
        ...state.cards,
        {
          id: nanoid(),
          type,
          content: '',
          position,
          todoItems: type === 'todo' ? [] : undefined,
        },
      ],
    })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    })),
  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),
  updateCardPosition: (id, position) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, position } : card
      ),
    })),
}));
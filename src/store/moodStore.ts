import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MoodState {
  selectedMoodId: string | null;
  setMood: (id: string | null) => void;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      selectedMoodId: null,
      setMood: (id) => set({ selectedMoodId: id }),
    }),
    {
      name: 'feastos-mood-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  isOpen: boolean;
}

interface LocationState {
  selectedLocation: Location | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      setLocation: (location) => set({ selectedLocation: location }),
      clearLocation: () => set({ selectedLocation: null }),
    }),
    {
      name: 'feast-os-location',
    }
  )
);

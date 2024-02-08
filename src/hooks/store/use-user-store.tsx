import { create } from 'zustand';

interface UserState {
  mid: number | undefined;
  setMID: (mid: number) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  mid: undefined,
  setMID: (mid: number) => set({ mid: mid }),
}));

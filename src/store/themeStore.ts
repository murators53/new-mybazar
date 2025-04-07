/* import { create } from "zustand";


type ThemeState = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
};


export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',
    toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' })
})); */
import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  transitionAt: number | null;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  transitionAt: null,
  toggleTheme: () => {
    const nextTheme = (state: ThemeState) =>
      state.theme === "dark" ? "light" : "dark";
    set((state) => ({
      theme: nextTheme(state),
      transitionAt: Date.now() + 1000,
    }));
  },
  setTheme: (theme) => {
    set({
      theme,
      transitionAt: Date.now() + 1000,
    });
  },
}));

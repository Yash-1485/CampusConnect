import { create } from 'zustand';

const useTheme = create((set) => ({
    theme: localStorage.getItem('theme') || 'light', // these will exported from here

    toggleTheme: () => // these will exported from here
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            // document.documentElement.setAttribute('data-theme', newTheme); to Set theme in main html element
            return { theme: newTheme };
        }),

    setTheme: (newTheme) => { // these will exported from here
        localStorage.setItem('theme', newTheme);
        // document.documentElement.setAttribute('data-theme', newTheme); to Set theme in main html element
        set({ theme: newTheme });
    },
}));

export default useTheme;
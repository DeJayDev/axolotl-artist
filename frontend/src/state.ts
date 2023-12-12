import { create } from 'zustand'
import { Media } from './types/media';

type SearchStore = {
    prompt?: string;
    size: number;
    setPrompt: (prompt: string) => void;
    setSize: (size: number) => void;
}

type MediaStore = {
    media: Media[];
    addMedia: (media: Media) => void;
    setMedia: (media: Media[]) => void;
    updateMedia: (id: string, media: Media) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
    prompt: undefined,
    size: 512,
    setPrompt: (prompt: string) => set({ prompt }),
    setSize: (size: number) => set({ size })
}));

const useMediaStore = create<MediaStore>((set) => ({
    media: [],
    addMedia: (media: Media) => set((state) => ({ media: [...state.media, media] })),
    setMedia: (media: Media[]) => set({ media }),
    updateMedia: (id: string, media: Media) => set((state) => ({ media: state.media.map((m) => (m.id === id ? media : m)) })),
}));

export { useSearchStore, useMediaStore }


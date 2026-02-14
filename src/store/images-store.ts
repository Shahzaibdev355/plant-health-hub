import { create } from "zustand";

export interface SavedImage {
  id: string;
  imageUrl: string;
  name: string;
  folderId: string | null; // null = ungrouped
  date: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

interface ImagesStore {
  folders: Folder[];
  images: SavedImage[];
  addFolder: (name: string) => string; 
  deleteFolder: (id: string) => void;
  addImage: (image: Omit<SavedImage, "id" | "date">) => void;
  deleteImage: (id: string) => void;
}


export const useImagesStore = create<ImagesStore>((set) => ({
  folders: [],
  images: [],



  addFolder: (name) => {
    const id = crypto.randomUUID();

    set((state) => ({
      folders: [
        ...state.folders,
        {
          id,
          name,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ],
    }));

    return id; 
  },



  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      // Move folder images to ungrouped
      images: state.images.map((img) => (img.folderId === id ? { ...img, folderId: null } : img)),
    })),
  addImage: (image) =>
    set((state) => ({
      images: [
        ...state.images,
        { ...image, id: crypto.randomUUID(), date: new Date().toISOString().split("T")[0] },
      ],
    })),
  deleteImage: (id) =>
    set((state) => ({ images: state.images.filter((img) => img.id !== id) })),
}));

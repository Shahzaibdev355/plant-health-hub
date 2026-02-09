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
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  addImage: (image: Omit<SavedImage, "id" | "date">) => void;
  deleteImage: (id: string) => void;
}

const placeholderImages: SavedImage[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    name: "Leaf Spot Sample",
    folderId: null,
    date: "2024-01-15",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
    name: "Powdery Mildew Sample",
    folderId: null,
    date: "2024-01-14",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
    name: "Bacterial Blight Sample",
    folderId: null,
    date: "2024-01-12",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400",
    name: "Healthy Plant",
    folderId: null,
    date: "2024-01-10",
  },
];

export const useImagesStore = create<ImagesStore>((set) => ({
  folders: [],
  images: placeholderImages,
  addFolder: (name) =>
    set((state) => ({
      folders: [
        ...state.folders,
        { id: crypto.randomUUID(), name, createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),
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

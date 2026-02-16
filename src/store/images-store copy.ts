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

  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  initializeStaticData: () => void;

  addFolder: (name: string) => string;
  deleteFolder: (id: string) => void;
  addImage: (image: Omit<SavedImage, "id" | "date">) => void;
  deleteImage: (id: string) => void;
}



export const useImagesStore = create<ImagesStore>((set) => ({
  folders: [],
  images: [],
  isLoading: false,
  setIsLoading: (value: boolean) => set({ isLoading: value }),



  initializeStaticData: () =>
    set((state) => {
      if (state.folders.length > 0) return state;

      const newFolders: Folder[] = [];
      const newImages: SavedImage[] = [];

      const STATIC_FOLDERS = [
        "Pepper__bell___Bacterial_spot",
        "Pepper__bell___healthy",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Tomato_Bacterial_spot",
        "Tomato_Early_blight",
        "Tomato_Late_blight",
        "Tomato_Leaf_Mold",
        "Tomato_Septoria_leaf_spot",
        "Tomato_Spider_mites_Two_spotted_spider_mite",
        "Tomato__Target_Spot",
        "Tomato__Tomato_YellowLeaf__Curl_Virus",
        "Tomato__Tomato_mosaic_virus",
        "Tomato_healthy",
      ];

      STATIC_FOLDERS.forEach((folderName) => {
        const folderId = crypto.randomUUID();

        newFolders.push({
          id: folderId,
          name: folderName,
          createdAt: new Date().toISOString().split("T")[0],
        });

        for (let i = 1; i <= 10; i++) {
          newImages.push({
            id: crypto.randomUUID(),
            imageUrl: `/images/${folderName}/(${i}).JPG`,
            name: `(${i}).JPG`,
            folderId,
            date: new Date().toISOString().split("T")[0],
          });
        }
      });

      return {
        folders: newFolders,
        images: newImages,
      };
    }),




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

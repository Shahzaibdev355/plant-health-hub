import { create } from "zustand";
import api from "@/api/axios";

export interface SavedImage {
  id: string;
  imageUrl: string;
  name: string;
  folderId: string;
  date: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  isDefault: boolean;
}

interface ImagesStore {
  folders: Folder[];
  images: SavedImage[];
  isLoading: boolean;

  initializeDefaultFolders: () => void;
  fetchUserFolders: () => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  uploadImage: (file: File, folderId: string) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
}

export const useImagesStore = create<ImagesStore>((set, get) => ({
  folders: [],
  images: [],
  isLoading: false,

  // ✅ DEFAULT FOLDERS (STATIC)
  initializeDefaultFolders: () => {
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

    const defaultFolders: Folder[] = STATIC_FOLDERS.map((name) => ({
      id: name,
      name,
      createdAt: new Date().toISOString(),
      isDefault: true,
    }));

    // Generate default images for each folder (10 images per folder)
    const defaultImages: SavedImage[] = [];
    STATIC_FOLDERS.forEach((folderName) => {
      for (let i = 1; i <= 10; i++) {
        defaultImages.push({
          id: `${folderName}_${i}`,
          imageUrl: `/images/${folderName}/(${i}).JPG`,
          name: `${folderName}_image_${i}`,
          folderId: folderName,
          date: new Date().toISOString(),
        });
      }
    });

    set({ folders: defaultFolders, images: defaultImages });
  },

  // ✅ FETCH USER FOLDERS
  fetchUserFolders: async () => {
    try {
      const res = await api.get(`/folders/get-folder`);

      const userFolders: Folder[] = res.data.data.map((f: any) => ({
        id: f._id,
        name: f.name,
        createdAt: f.createdAt,
        isDefault: false,
      }));

      // Sort user folders by creation date (newest first)
      userFolders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      set((state) => ({
        folders: [
          ...userFolders, // User folders first (newest first)
          ...state.folders.filter(f => f.isDefault), // Default folders last
        ],
        // Keep existing images (including default ones)
      }));
    } catch (error) {
      console.error("Fetch folders error:", error);
    }
  },

  // ✅ CREATE FOLDER
  createFolder: async (name: string) => {
    try {
      const res = await api.post(`/folders/create-folder`, { name });

      const folder = res.data.data;

      const newFolder = {
        id: folder._id,
        name: folder.name,
        createdAt: folder.createdAt,
        isDefault: false,
      };

      set((state) => ({
        folders: [
          newFolder, // New folder first
          ...state.folders.filter(f => !f.isDefault), // Other user folders
          ...state.folders.filter(f => f.isDefault), // Default folders last
        ],
      }));
    } catch (error) {
      console.error("Create folder error:", error);
    }
  },

  // ✅ DELETE FOLDER (only user folders)
  deleteFolder: async (id: string) => {
    const folder = get().folders.find(f => f.id === id);
    if (!folder || folder.isDefault) return;

    try {
      await api.delete(`/folders/delete-folder/${id}`);

      set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        images: state.images.filter((img) => img.folderId !== id),
      }));
    } catch (error) {
      console.error("Delete folder error:", error);
    }
  },

  // ✅ UPLOAD IMAGE
  uploadImage: async (file: File, folderId: string) => {
    const folder = get().folders.find(f => f.id === folderId);
    if (!folder || folder.isDefault) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(
        `/images/image-upload/${folderId}`,
        formData
      );

      const img = res.data.data;

      set((state) => ({
        images: [
          ...state.images,
          {
            id: img._id,
            imageUrl: img.imageUrl,
            name: img.publicId,
            folderId: img.folderId,
            date: img.createdAt,
          },
        ],
      }));
    } catch (error) {
      console.error("Upload error:", error);
    }
  },

  // ✅ DELETE IMAGE
  deleteImage: async (id: string) => {
    try {
      await api.delete(`/images/image-delete/${id}`);

      set((state) => ({
        images: state.images.filter((img) => img.id !== id),
      }));
    } catch (error) {
      console.error("Delete image error:", error);
    }
  },
}));

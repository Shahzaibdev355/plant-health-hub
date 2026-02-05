import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: number;
  twoFactorActivated: boolean;
  createdAt: string;
}

type AuthState = {
  isLoggedIn: boolean;
  otpVerified: boolean;
  twoFactorEnabled: boolean;
  accessToken: string | null;
  userId: string | null;
  qrDataUrl?: string;

  userProfile: UserProfile | null;

  setLogin: (token: string, userId: string, twoFactorEnabled: boolean) => void;
  setQrDataUrl: (url: string) => void;
  setOtpVerified: () => void;

  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      otpVerified: false,
      twoFactorEnabled: false,
      accessToken: null,
      userId: null,

      userProfile: null,

      setLogin: (token, userId, twoFactorEnabled) =>
        set({
          isLoggedIn: true,
          accessToken: token,
          userId,
          twoFactorEnabled,
        }),

      setQrDataUrl: (url) => set({ qrDataUrl: url }),

      setOtpVerified: () =>
        set({
          otpVerified: true,
        }),

      setUserProfile: (profile) => set({ userProfile: profile }),

      clearUserProfile: () => set({ userProfile: null }),

      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          isLoggedIn: false,
          otpVerified: false,
          twoFactorEnabled: false,
          accessToken: null,
          userId: null,
          userProfile: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

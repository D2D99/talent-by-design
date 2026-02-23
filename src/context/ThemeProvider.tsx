// import { useCallback, useEffect, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import { ThemeContext, type ThemeMode } from "./useTheme";
// import api from "../services/axios";

// const THEME_STORAGE_KEY = "tbd-theme";

// const isThemeMode = (value: string | null): value is ThemeMode =>
//   value === "light" || value === "dark";

// const extractThemeFromProfile = (profile: any): ThemeMode | null => {
//   const candidates = [
//     profile?.theme,
//     profile?.themeMode,
//     profile?.themePreference,
//     profile?.appearanceTheme,
//     profile?.preferences?.theme,
//     profile?.settings?.theme,
//     profile?.notificationPreferences?.theme,
//     profile?.user?.theme,
//     profile?.user?.themeMode,
//   ];

//   for (const candidate of candidates) {
//     if (isThemeMode(candidate ?? null)) {
//       return candidate;
//     }
//   }

//   return null;
// };

// const getInitialTheme = (): ThemeMode => {
//   if (typeof window === "undefined") {
//     return "light";
//   }

//   const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
//   if (isThemeMode(storedTheme)) {
//     return storedTheme;
//   }

//   return "light";
// };

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
//   const [isServerHydrated, setIsServerHydrated] = useState(false);
//   const saveDebounceRef = useRef<number | null>(null);

//   const hydrateThemeFromProfile = useCallback(async () => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       setIsServerHydrated(true);
//       return;
//     }

//     try {
//       const profileRes = await api.get("auth/my-profile");
//       const serverTheme = extractThemeFromProfile(profileRes.data);
//       if (serverTheme) {
//         setTheme(serverTheme);
//         localStorage.setItem(THEME_STORAGE_KEY, serverTheme);
//       }
//     } catch {
//       // Silent fail: local storage theme still works as fallback.
//     } finally {
//       setIsServerHydrated(true);
//     }
//   }, []);

//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.toggle("dark", theme === "dark");
//     root.classList.toggle("light", theme === "light");
//     localStorage.setItem(THEME_STORAGE_KEY, theme);
//   }, [theme]);

//   useEffect(() => {
//     hydrateThemeFromProfile();
//   }, [hydrateThemeFromProfile]);

//   useEffect(() => {
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key !== THEME_STORAGE_KEY || !isThemeMode(e.newValue)) {
//         return;
//       }
//       setTheme(e.newValue);
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   useEffect(() => {
//     const handleAuthChange = () => {
//       void hydrateThemeFromProfile();
//     };

//     window.addEventListener("auth-changed", handleAuthChange);
//     return () => window.removeEventListener("auth-changed", handleAuthChange);
//   }, [hydrateThemeFromProfile]);

//   useEffect(() => {
//     if (!isServerHydrated) {
//       return;
//     }

//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       return;
//     }

//     if (saveDebounceRef.current) {
//       window.clearTimeout(saveDebounceRef.current);
//     }

//     saveDebounceRef.current = window.setTimeout(async () => {
//       try {
//         await api.patch("/auth/update-notifications", { theme });
//       } catch {
//         // If API does not support theme yet, keep local fallback without breaking UX.
//       }
//     }, 350);

//     return () => {
//       if (saveDebounceRef.current) {
//         window.clearTimeout(saveDebounceRef.current);
//       }
//     };
//   }, [theme, isServerHydrated]);

//   return (
//     <ThemeContext.Provider
//       value={{
//         theme,
//         isDark: theme === "dark",
//         setTheme,
//         toggleTheme: () =>
//           setTheme((currentTheme) =>
//             currentTheme === "dark" ? "light" : "dark",
//           ),
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };

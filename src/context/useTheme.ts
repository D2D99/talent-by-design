// import { createContext, useContext } from "react";

// export type ThemeMode = "light" | "dark";

// export interface ThemeContextType {
//   theme: ThemeMode;
//   isDark: boolean;
//   setTheme: (nextTheme: ThemeMode) => void;
//   toggleTheme: () => void;
// }

// export const ThemeContext = createContext<ThemeContextType | undefined>(
//   undefined,
// );

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };

// src/global.d.ts or any .d.ts file in your src folder
declare global {
  interface Window {
    Highcharts: typeof import("highcharts");
  }
}

export {};

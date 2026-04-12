// src/electron.d.ts
declare global {
  interface Window {
    electron: {
      requestData: () => void;
      sendData: (data: any) => Promise<any>;
      saveTAMForm: (data: any) => void;
      onResponseData: (callback: (event: any, data: any) => void) => () => void;
      loadNetWorthData: () => Promise<any>;
      saveNetWorthEntry: (entry: any) => Promise<any>;
      deleteNetWorthEntry: (entryId: string) => Promise<any>;
      loadRpData: () => Promise<any>;
      saveRpItem: (item: any) => Promise<any>;
      deleteRpItem: (itemId: string) => Promise<any>;
    };
  }
}

declare module 'tailwindcss/tailwind-config' {
  interface DefaultColors {
    colors: {
      nobleBlack: string;
      nobleGold: string;
      lightNobleBlack: string;
      lightGray: string;
      softWhite: string;
      sidebar: string;
      error: string;
      secondaryGold: string;
      succesGreen: string;
    };
  }
}

declare module "*.png";
declare module "chart.svg";
declare module "*.jpeg";
declare module "*.jpg";

export {  };

import { create } from "zustand";
import type { ModalsState } from "./ModalsModels";

export const useModalsStore = create<ModalsState>((set) => ({
  showCreateLinkModal: false,
  setCreateLinkModal: (value: boolean) => {
    set((state: ModalsState) => ({
      ...state,
      showCreateLinkModal: value,
    }));
  },
  showStatisticModal: false,
  setStatisticModal: (value: boolean) => {
    set((state: ModalsState) => ({
      ...state,
      showStatisticModal: value,
    }));
  },
}));

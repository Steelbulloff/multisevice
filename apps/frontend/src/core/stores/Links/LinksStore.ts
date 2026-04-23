import { create } from "zustand";
import { notification } from "antd";
import type { LinksState } from "./LinksModels";
import type { Link } from "../../models";
import { linksApiService } from "../../services";

export const useLinksStore = create<LinksState>((set) => ({
  linksReady: false,
  links: [],
  selectedLink: null,
  selectedLinks: [],
  error: null,
  selectedDomain: null,
  selectedDomainId: null,

  setSelectedLinks: (ids: any[]) => {
    set({ selectedLinks: ids });
  },

  setSelectedLink: (link: Link) => {
    set((state: LinksState) => ({
      ...state,
      selectedLink: link,
    }));
  },

  setSelectedDomain: (domain: string) => {
    set({ selectedDomain: domain });
  },
  setSelectedDomainId: (
    selectedLinkId: number,
    domainId: number,
    allDates: string[],
  ) => {
    set({ selectedDomainId: domainId });

    linksApiService.getLinkInfo(selectedLinkId, allDates, domainId);
  },

  createLink: async (name: string, origin: string) => {
    set({ linksReady: false });
    try {
      const created = await linksApiService.createLink(name, origin);
      if (!created) {
        throw new Error("Ошибка создания ссылки!!!");
      }
      const links = await linksApiService.getLinks();
      set({
        links: links?.length > 0 ? links : [],
        linksReady: true,
        error: null,
      });
    } catch (error: any) {
      set({ error: error });
      notification.error({
        message: "Ошибка при создании ссылки",
        description: error?.response?.data?.message ?? "Ошибка",
      });
    }
  },
  getLinks: async () => {
    set({ linksReady: false });

    try {
      const links = await linksApiService.getLinks();
      set({
        links: links?.length > 0 ? links : [],
        linksReady: true,
        error: null,
      });
    } catch (error: any) {
      set({ error: error });
      notification.error({
        message: "Ошибка при получении ссылок",
        description: error?.response?.data?.message ?? "Ошибка",
      });
    }
  },
  removeSelectedLinks: async (selectedLinks: number[]) => {
    set({ linksReady: false });
    try {
      const removedLinks = await linksApiService.removeLinks(selectedLinks);
      set({
        links: removedLinks?.length > 0 ? removedLinks : [],
        linksReady: true,
        error: null,
      });
    } catch (error: any) {
      set({ error: error });
      notification.error({
        message: "Ошибка при создании ссылки",
        description: error?.response?.data?.message ?? "Ошибка",
      });
    }
  },
}));

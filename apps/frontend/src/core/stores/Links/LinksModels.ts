import type { Link } from "../../models";

export interface LinksState {
  links: Link[];
  selectedLink: null | Link;
  selectedLinks: number[];
  selectedDomain: string | null;
  selectedDomainId: number | null;
  error: unknown;
  linksReady: boolean;

  createLink: (name: string, origin: string) => void;
  removeSelectedLinks: (selectedLinks: number[]) => void;
  setSelectedLinks: (id: any[]) => void;
  setSelectedLink: (link: Link) => void;
  setSelectedDomain: (domain: string) => void;
  setSelectedDomainId: (
    selectedLinkId: number,
    domainId: number,
    allDates: string[],
  ) => void;
  getLinks: () => void;
}

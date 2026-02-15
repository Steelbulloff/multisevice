import type { Link } from "../../models";

export interface LinksState {
  links: Link[];
  selectedLink: null | Link;
  selectedLinks: number[];
  error: unknown;
  linksReady: boolean;

  createLink: (name: string, origin: string) => void;
  removeSelectedLinks: (selectedLinks: number[]) => void;
  setSelectedLinks: (id: any[]) => void;
  setSelectedLink: (link: Link) => void;
  getLinks: () => void;
}

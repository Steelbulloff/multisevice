export interface Link {
  createdAt: Date;
  id: number;
  name: string;
  origin: string;
  short_link: string;
  domains: LinkDomen[];
  statistic: {
    days_info: {
      counter: number;
      createdAt: Date;
      date: Date;
      id: number;
    }[];
    global_counter: number;
    id: number;
  };
}
interface LinkDomen {
  id: number;
  name: string;
  domen: string;
}

export interface LinksColumnsDataTypes {
  key: number;
  id: number;
  action: Link; // Весь объект ссылки для кнопок
  domens: Link;
  name: string;
  origin: string;
  newLink: string;
  counter: number;
  createdAt: Date;
}

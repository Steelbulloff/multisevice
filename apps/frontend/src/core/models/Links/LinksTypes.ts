export interface Link {
  createdAt: Date;
  id: number;
  name: string;
  origin: string;
  short_link: string;
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

export interface LinksColumnsDataTypes {
  key: number;
  id: number;
  func: Link; // Весь объект ссылки для кнопок
  name: string;
  origin: string;
  newLink: string;
  counter: number;
  createdAt: Date;
}

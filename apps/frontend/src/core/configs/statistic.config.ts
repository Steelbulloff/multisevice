import type { PickerLocale } from "antd/es/date-picker/generatePicker";
import CalendarLocale from "rc-picker/lib/locale/ru_RU";
import type { Link } from "../models";

export const GraphData = (link: Link) => {
  return link.statistic.days_info
    .map((e) => ({
      ...e,
      name: e.date,
      Cчетчик: e.counter, // 👈 используем как ось X
    }))
    .reverse();
};

export const locale: PickerLocale = {
  lang: {
    placeholder: "Выберите дату",
    yearPlaceholder: "Выберите год",
    quarterPlaceholder: "Выберите квартал",
    monthPlaceholder: "Выберите месяц",
    weekPlaceholder: "Выберите неделю",
    rangePlaceholder: ["Начальная дата", "Конечная дата"],
    rangeYearPlaceholder: ["Начальный год", "Год окончания"],
    rangeMonthPlaceholder: ["Начальный месяц", "Конечный месяц"],
    rangeWeekPlaceholder: ["Начальная неделя", "Конечная неделя"],
    shortWeekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    shortMonths: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    ...CalendarLocale,
  },
  timePickerLocale: {
    placeholder: "Выберите время",
    rangePlaceholder: ["Время начала", "Время окончания"],
  },
};

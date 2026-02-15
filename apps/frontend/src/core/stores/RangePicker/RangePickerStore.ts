import { create } from "zustand";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type { RangePickerState } from "./RangePickerModels";
import { linksApiService } from "../../services";

dayjs.extend(isSameOrBefore);

export const useRangePickerStore = create<RangePickerState>((set) => ({
  start: null,
  end: null,
  allDates: [],
  setDatesRange: (dates, selectedLinkId) => {
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;

      // Создаем массив только с начальной и конечной датами
      const allDates = [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")];

      set(() => ({
        start,
        end,
        allDates,
      }));

      console.log(allDates);

      if (selectedLinkId !== null) {
        linksApiService.getLinkInfo(selectedLinkId, allDates);
      }
    } else {
      set(() => ({
        start: null,
        end: null,
        allDates: [],
      }));
    }
  },
}));

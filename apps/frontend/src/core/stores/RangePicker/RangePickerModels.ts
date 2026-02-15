import { Dayjs } from "dayjs";

export interface RangePickerState {
  start: Dayjs | null;
  end: Dayjs | null;
  allDates: string[];
  setDatesRange: (
    dates: [Dayjs | null, Dayjs | null] | null,
    selectedLinkId: number | null,
  ) => void;
}

import { DatePicker } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { locale, useLinksStore, useRangePickerStore } from "../../../../core";
dayjs.extend(isSameOrBefore);

export const RangePicker = () => {
  const { RangePicker } = DatePicker;
  const { setDatesRange } = useRangePickerStore();
  const { selectedLink } = useLinksStore();

  return (
    <RangePicker
      locale={locale}
      onChange={(dates) => {
        setDatesRange(dates, selectedLink ? selectedLink.id : null);
      }}
    />
  );
};

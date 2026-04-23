import { Select } from "antd";
import { useLinksStore, useRangePickerStore } from "../../../../core";

export const DomainPicker = () => {
  const { selectedLink, setSelectedDomainId } = useLinksStore();
  const { allDates } = useRangePickerStore();

  return (
    <Select
      onChange={(val) => {
        if (selectedLink) setSelectedDomainId(selectedLink.id, val, allDates);
      }}
      //   defaultValue={selectedLink?.domains[0].id}
      options={selectedLink?.domains.map((el) => {
        return { value: el.id, label: el.name };
      })}
    />
  );
};

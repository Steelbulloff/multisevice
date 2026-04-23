import { type FC } from "react";
import { Flex, Modal } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GraphData, useLinksStore, useModalsStore } from "../../../../core";
import { DomainPicker } from "../../../../pages/Links/components";
import { RangePicker } from "../../Components";

export const Statistic: FC = () => {
  const { showStatisticModal, setStatisticModal } = useModalsStore();
  const { selectedLink } = useLinksStore();

  const data = selectedLink ? GraphData(selectedLink) : [];

  // TODO: Реализовать фильтр по промежутку дат
  return (
    <Modal
      title={"Статистика по ссылке " + selectedLink?.name}
      open={showStatisticModal}
      width="90vmax"
      styles={{ body: { height: "60vh", padding: "16px" } }} // ✅ вместо bodyStyle
      onCancel={() => setStatisticModal(false)}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Cчетчик" stackId="a" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Flex gap={"1rem"}>
        <DomainPicker />
        <RangePicker />
      </Flex>
    </Modal>
  );
};

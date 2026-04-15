import { StockOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { format } from "date-fns";
import type { Link, LinksColumnsDataTypes } from "../models";
import { useLinksStore, useModalsStore } from "../stores";

export const getColumns = (): ColumnType<LinksColumnsDataTypes>[] => {
  const { setSelectedLink, setSelectedDomen, selectedDomen } = useLinksStore();
  const { setStatisticModal } = useModalsStore();

  return [
    { title: "id", dataIndex: "id" },
    {
      title: "Функционал",
      dataIndex: "action",
      render: (el: Link) => (
        <Flex justify="center">
          <Button
            onClick={() => {
              setSelectedLink(el);
              setStatisticModal(true);
              console.log(el);
            }}
            icon={<StockOutlined />}
          ></Button>
        </Flex>
      ),
    },
    {
      title: "Домен",
      dataIndex: "domens",
      render: (el: Link) => (
        <Select
          defaultValue={el.domains[0]?.name}
          style={{ width: 120 }}
          onChange={(domen) => setSelectedDomen(domen)}
          options={el.domains.map((domenObj) => {
            return { value: domenObj.domen, label: domenObj.name };
          })}
        />
      ),
    },
    { title: "Название", dataIndex: "name", align: "center" },
    { title: "Оригинальная ссылка", dataIndex: "origin", align: "center" },
    {
      title: "Короткая ссылка",
      dataIndex: "newLink",
      align: "center",
      render: (shortLink: string) => (
        <Typography.Paragraph
          style={{ marginBottom: 0, marginTop: 0 }}
          copyable
        >
          {selectedDomen + "/" + shortLink}
        </Typography.Paragraph>
      ),
    },
    { title: "Переходы", dataIndex: "counter", align: "center" },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt: Date) => (
        <Typography>
          {format(new Date(createdAt), "dd.MM.yyyy HH:mm")}
        </Typography>
      ),
    },
  ];
};

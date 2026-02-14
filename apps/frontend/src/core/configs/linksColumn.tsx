import { StockOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { format } from "date-fns";
import type { Link, LinksColumnsDataTypes } from "../models";

export const getColumns = (): ColumnType<LinksColumnsDataTypes>[] => [
  { title: "id", dataIndex: "id" },
  {
    title: "Функционал",
    dataIndex: "action",
    render: (el: Link) => (
      <Flex justify="center">
        <Button
          onClick={() => {
            // setSelectedLink(el);
            //   setStatisticModal(true);
            console.log(el);
          }}
          icon={<StockOutlined />}
        ></Button>
      </Flex>
    ),
  },
  { title: "Название", dataIndex: "name", align: "center" },
  { title: "Оригинальная ссылка", dataIndex: "origin", align: "center" },
  {
    title: "Короткая ссылка",
    dataIndex: "newLink",
    align: "center",
    render: (shortLink: string) => (
      <Typography.Paragraph style={{ marginBottom: 0, marginTop: 0 }} copyable>
        {shortLink}
      </Typography.Paragraph>
    ),
  },
  { title: "Переходы", dataIndex: "counter", align: "center" },
  {
    title: "Дата создания",
    dataIndex: "createdAt",
    align: "center",
    render: (createdAt: Date) => (
      <Typography>{format(new Date(createdAt), "dd.MM.yyyy HH:mm")}</Typography>
    ),
  },
];

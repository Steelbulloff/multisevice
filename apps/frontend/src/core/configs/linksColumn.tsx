import { StockOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Tag, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { format } from "date-fns";
import type { Link, LinksColumnsDataTypes } from "../models";
import { useLinksStore, useModalsStore } from "../stores";
import type { TagType } from "../../shared";

export const getColumns = (): ColumnType<LinksColumnsDataTypes>[] => {
  const { setSelectedLink, setSelectedDomain, selectedDomain } =
    useLinksStore();
  const { setStatisticModal } = useModalsStore();

  const tagsPreset = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  return [
    { title: "id", dataIndex: "id" },
    {
      title: "Теги",
      dataIndex: "tags",
      align: "center",
      render: (el: TagType[]) => (
        <Flex gap={"small"} justify="center" wrap style={{ maxWidth: "120px" }}>
          {el.map((tag) => (
            <Tag
              key={tag.id}
              color={tagsPreset[Math.floor(Math.random() * tagsPreset.length)]}
            >
              {tag.name}
            </Tag>
          ))}
        </Flex>
      ),
    },
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
      align: "center",
      render: (el: Link) => (
        <Select
          defaultValue={el.domains[0]?.name}
          style={{ width: 120 }}
          onChange={(domain) => setSelectedDomain(domain)}
          options={el.domains.map((domenObj) => {
            return { value: domenObj.domain, label: domenObj.name };
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
          {selectedDomain + "/" + shortLink}
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

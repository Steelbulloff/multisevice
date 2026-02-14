import styles from "./styles.module.scss";
import { Button, Flex, Popconfirm, Table, Typography } from "antd";
import { getColumns, type Link, type LinksColumnsDataTypes } from "../../core";

export const Links = () => {
  const columns = getColumns();
  const links = [
    {
      id: 1,
      name: "Главная страница (рекламная кампания)",
      origin: "https://myshop.com",
      short_link: "https://clck.ru",
      createdAt: new Date("2023-10-01T10:00:00Z"),
      statistic: {
        id: 42,
        global_counter: 150,
        days_info: [
          {
            id: 101,
            counter: 45,
            date: new Date("2023-10-14"),
            createdAt: new Date("2023-10-14T23:59:59Z"),
          },
          {
            id: 102,
            counter: 105,
            date: new Date("2023-10-15"),
            createdAt: new Date("2023-10-15T23:59:59Z"),
          },
        ],
      },
    },
  ];
  const dataSource: LinksColumnsDataTypes[] = links.map((el: Link) => ({
    key: el.id,
    id: el.id,
    func: el,
    name: el.name,
    origin: el.origin,
    newLink: el.short_link,
    counter: el.statistic.global_counter,
    createdAt: el.createdAt,
  }));
  // const rowSelection = {
  //   selectedRowKeys: selectedLinks,
  //   onChange: setSelectedLinks,
  // };

  return (
    <Flex className={styles.links} vertical flex={1}>
      <Typography.Title level={2}>Мои ссылки</Typography.Title>
      <Flex gap={"small"}>
        <Button onClick={() => {}}>Сократить ссылку</Button>

        {/* {selectedLinks.length > 0 && ( */}
        <Popconfirm
          title={"Удалить выбранные ссылки"}
          description={
            "Вы действительно хотите удалить ссылки без возможности возврата?"
          }
          onConfirm={() =>
            // removeSelectedLinks(selectedLinks)
            console.log(1)
          }
          okText={"Да"}
          cancelText={"Нет"}
        >
          <Button>Удалить выбранные</Button>
        </Popconfirm>
        {/* )} */}
      </Flex>

      <Table<LinksColumnsDataTypes>
        columns={columns}
        // rowSelection={rowSelection}
        dataSource={dataSource}
        scroll={{ x: true }} // Если ваши таблицы могут быть слишком широкими, скроллинг по горизонтали
      />
    </Flex>
  );
};

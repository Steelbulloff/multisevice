import styles from "./styles.module.scss";
import { Button, Flex, Popconfirm, Table, Typography } from "antd";
import {
  getColumns,
  useLinksStore,
  useModalsStore,
  type Link,
  type LinksColumnsDataTypes,
} from "../../core";
import { useEffect } from "react";

export const Links = () => {
  const {
    links,
    selectedLinks,
    setSelectedLinks,
    removeSelectedLinks,
    getLinks,
    setSelectedDomain,
  } = useLinksStore();
  const { setCreateLinkModal } = useModalsStore();

  const rowSelection = {
    selectedRowKeys: selectedLinks,
    onChange: setSelectedLinks,
  };

  useEffect(() => {
    getLinks();
  }, []);
  const testTags = [
    {
      id: 1,
      name: "kek",
    },
    {
      id: 2,
      name: "asdasd",
    },
    {
      id: 3,
      name: "zxczxc",
    },
    {
      id: 4,
      name: "kdfgdfek",
    },
    {
      id: 5,
      name: "dfgdfhhjh",
    },
  ];

  const dataSource: LinksColumnsDataTypes[] = links.map((el: Link) => ({
    key: el.id,
    id: el.id,
    tags: testTags,
    // tags: el.tags,
    action: el,
    domens: el,
    name: el.name,
    origin: el.origin,
    newLink: el.short_link,
    counter: el.statistic.global_counter,
    createdAt: el.createdAt,
  }));

  useEffect(() => {
    setSelectedDomain(links[0]?.domains[0]?.domain);
  }, [links]);

  return (
    <Flex className={styles.links} vertical flex={1}>
      <Typography.Title level={2}>Мои ссылки</Typography.Title>
      <Flex gap={"small"}>
        <Button onClick={() => setCreateLinkModal(true)}>
          Сократить ссылку
        </Button>

        {selectedLinks.length > 0 && (
          <Popconfirm
            title={"Удалить выбранные ссылки"}
            description={
              "Вы действительно хотите удалить ссылки без возможности возврата?"
            }
            onConfirm={() => removeSelectedLinks(selectedLinks)}
            okText={"Да"}
            cancelText={"Нет"}
          >
            <Button>Удалить выбранные</Button>
          </Popconfirm>
        )}
      </Flex>

      <Table<LinksColumnsDataTypes>
        columns={getColumns()}
        rowSelection={rowSelection}
        dataSource={dataSource}
        scroll={{ x: true }} // Если ваши таблицы могут быть слишком широкими, скроллинг по горизонтали
      />
    </Flex>
  );
};

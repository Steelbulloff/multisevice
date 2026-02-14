import { Flex, Typography } from "antd";

import styles from "./styles.module.scss";

export const Main = () => {
  return (
    <Flex className={styles.main} flex={1}>
      <Typography.Title level={2}>Главная</Typography.Title>
    </Flex>
  );
};

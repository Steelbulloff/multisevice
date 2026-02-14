import { Flex } from "antd";
import { Loguot, Navigation } from "./components";

import styles from "./styles.module.scss";
export const Leftbar = () => {
  return (
    <Flex className={styles.leftbar} vertical align="center" flex={1}>
      <Navigation />
      <Flex vertical align="start" style={{ width: "100%" }}>
        <Loguot />
      </Flex>
    </Flex>
  );
};

import { Flex, Menu } from "antd";
import { navigation_array } from "../../../../core/configs";

import styles from "./styles.module.scss";
import { useNavigate } from "react-router";

export const Navigation = () => {
  const navigate = useNavigate();
  return (
    <Flex className={styles.nav} flex={1} align="center" vertical>
      <Menu
        title="Страницы"
        items={navigation_array}
        onClick={(item) => {
          navigate("/" + item.key);
        }}
      />
    </Flex>
  );
};

import { Button } from "antd";
import { useAuthStore } from "../../../../core";

import styles from "./styles.module.scss";

export const Loguot = () => {
  const { logOut } = useAuthStore();
  return (
    <Button className={styles.logout_button} onClick={() => logOut()}>
      Выйти
    </Button>
  );
};

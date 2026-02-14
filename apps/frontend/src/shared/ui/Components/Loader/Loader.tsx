import { SyncOutlined } from "@ant-design/icons";
import { Flex } from "antd";

type LoaderProps = {
  size?: "default" | "large" | "fullscreen";
};

export const Loader = ({ size = "default" }: LoaderProps) => {
  const iconSize = size === "large" ? 48 : size === "fullscreen" ? 64 : 24;

  const loader = <SyncOutlined spin style={{ fontSize: iconSize }} />;

  if (size === "fullscreen") {
    return (
      <Flex justify="center" align="center">
        {loader}
      </Flex>
    );
  }

  return loader;
};

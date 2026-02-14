import { Flex } from "antd";
import { Navigate } from "react-router";
import { Pages } from "./routes";
import { Leftbar } from "../widgets";

import "./index.scss";
import { useAuthStore } from "../core";
import { useEffect } from "react";
import { Loader } from "../shared";

function App() {
  const { isAuthenticated, initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading)
    return (
      <Flex align="center" justify="center" flex={1}>
        <Loader size="fullscreen" />
      </Flex>
    );

  return (
    <>
      {isAuthenticated ? (
        <Flex flex={1}>
          <Leftbar />
          <Pages />
        </Flex>
      ) : (
        <>
          <Pages />
          <Navigate to="/auth" replace />
        </>
      )}
    </>
  );
}

export default App;

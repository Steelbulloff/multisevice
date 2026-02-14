import { ConfigProvider, Switch } from "antd";
import { useEffect, useState } from "react";
import { themes } from "./core/configs/antd";
import App from "./app/App";

export const Root = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "Dark",
  );
  const [currentTheme, setCurrentTheme] = useState(
    isDark ? themes.dark : themes.light,
  );

  useEffect(() => {
    const root = document.getElementById("root");
    root?.classList.toggle("dark-theme", isDark);
    localStorage.setItem("theme", isDark ? "Dark" : "Light");
    setCurrentTheme(isDark ? themes.dark : themes.light);
  }, [isDark]);

  return (
    <ConfigProvider theme={currentTheme}>
      <div style={{ padding: 16 }}>
        <Switch
          checked={isDark}
          onChange={setIsDark}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </div>
      <App />
    </ConfigProvider>
  );
};

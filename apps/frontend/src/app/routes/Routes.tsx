import { Route, Routes } from "react-router";
import { Auth, Links, Main } from "../../pages";

export const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/links" element={<Links />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

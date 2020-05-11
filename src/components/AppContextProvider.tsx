import React, { createContext, FC, useEffect, useState } from "react";
import { Pages } from "../Pages";

interface Context {
  page: Pages;
  setPage: (page: Pages) => void;
  fromDir: string;
  setFromDir: (dir: string) => void;
  toDir: string;
  setToDir: (dir: string) => void;
}

export const AppContext = createContext<Context>({
  page: Pages.TOOL_SELECT,
  setPage: () => {},
  fromDir: "",
  setFromDir: () => {},
  toDir: "",
  setToDir: () => {}
});

export const AppContextProvider: FC = ({ children }) => {
  const [page, setPage] = useState<Pages>(Pages.TOOL_SELECT);
  const [fromDir, setFromDir] = useState<string>("");
  const [toDir, setToDir] = useState<string>("");

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        fromDir,
        setFromDir,
        toDir,
        setToDir
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

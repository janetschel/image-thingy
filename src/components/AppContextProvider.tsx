import React, { createContext, FC, useEffect, useState } from "react";
import { Pages } from "../Pages";

interface Context {
  page: Pages;
  setPage: (page: Pages) => void;
}

export const AppContext = createContext<Context>({
  page: Pages.TOOL_SELECT,
  setPage: () => {}
});

export const AppContextProvider: FC = ({ children }) => {
  const [page, setPage] = useState<Pages>(Pages.TOOL_SELECT);

  return (
    <AppContext.Provider
      value={{
        page,
        setPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

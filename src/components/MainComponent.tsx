import React, { FC, useCallback, useContext } from "react";
import { AppContext } from "./AppContextProvider";
import { Pages } from "../Pages";
import { ToolSelector } from "./ToolSelector";
import { SortSelector } from "./SortSelector";
import { ImageSelector } from "./ImageSelector";
import { Header } from "./Header";

export const MainComponent: FC = () => {
  const { page, setPage } = useContext(AppContext);

  let component;

  switch (page) {
    case Pages.TOOL_SELECT:
      component = <ToolSelector />;
      break;
    case Pages.SORT_FOLDER_SELECT:
      component = <SortSelector />;
      break;
    case Pages.SORT:
      component = <ImageSelector />;
      break;
    case Pages.EDIT_FOLDER_SELECT:
      component = "WIP";
      break;
    case Pages.EDIT:
      component = "WIP";
  }

  const handleBackClick = useCallback(() => {
    let newPage = Pages.TOOL_SELECT;
    switch (page) {
      case Pages.TOOL_SELECT:
      case Pages.SORT_FOLDER_SELECT:
      case Pages.EDIT_FOLDER_SELECT:
        newPage = Pages.TOOL_SELECT;
        break;
      case Pages.SORT:
        newPage = Pages.SORT_FOLDER_SELECT;
        break;
      case Pages.EDIT:
        newPage = Pages.EDIT_FOLDER_SELECT;
        break;
    }

    setPage(newPage);
  }, [page, setPage]);

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {page !== Pages.TOOL_SELECT && <Header onBackClick={handleBackClick} />}
      {component}
    </div>
  );
};

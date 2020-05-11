import React, { FC, useContext } from "react";
import { AppContext } from "./AppContextProvider";
import { Pages } from "../Pages";
import { ToolSelector } from "./ToolSelector";
import { SortSelector } from "./SortSelector";
import { ImageSelector } from "./ImageSelector";

export const MainComponent: FC = () => {
  const { page } = useContext(AppContext);

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
  }

  return <>{component}</>;
};

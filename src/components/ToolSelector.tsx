import React, { FC, useContext } from "react";
import { ToolButton } from "./ToolButton";
import { Headline } from "../util/smallComponents";
import { AppContext } from "./AppContextProvider";
import { Pages } from "../Pages";

export const ToolSelector: FC = () => {
  const { setPage } = useContext(AppContext);

  return (
    <div>
      <Headline style={{ marginLeft: 10 }}>Was möchtest du tun?</Headline>
      <ToolButton
        text="Bilder sortieren"
        onClick={() => setPage(Pages.SORT_FOLDER_SELECT)}
      />
      <ToolButton
        text="Bilder bearbeiten"
        onClick={() => setPage(Pages.EDIT_FOLDER_SELECT)}
      />
    </div>
  );
};

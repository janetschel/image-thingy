import React, { FC, useContext, useRef, useState } from "react";
import { Button, Headline, IconButton } from "../../util/smallComponents";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { AppContext } from "../AppContextProvider";
import { Pages } from "../../Pages";
import {
  ContainerDiv,
  ErrorMessage,
  InnerDiv,
  LIGHT_GREY,
  OuterDiv,
} from "../folderSelectShared";
import { shakeButton } from '../../util/functions';

export const EditFolderSelect: FC = () => {
  const { fromDir, setFromDir, setPage } = useContext(AppContext);
  const [errorMessage, setErrorMessage] = useState("");
  const continueButton = useRef(null);

  const handleDirectoryChange = () => {
    window.electron.dialog
      .showOpenDialog({
        filters: [{ name: "Folders" }],
        properties: ["openFile", "openDirectory", "promptToCreate"],
      })
      .then((result) => {
        if (!result.canceled) {
          const path = result.filePaths[0].replace(/\\/g, "/");
          setFromDir(path);
        }
      });
  };

  const handleContinueClick = () => {
    setErrorMessage("");

    if (fromDir === "") {
      setErrorMessage("In welchem Ordner möchtest du Bilder bearbeiten?");
      shakeButton(continueButton);
    } else {
      setPage(Pages.EDIT);
    }
  };

  return (
    <ContainerDiv>
      <OuterDiv>
        <Headline>Bearbeite meine Bilder</Headline>
        <InnerDiv>
          <span>in</span>
          <Button
            style={{ color: fromDir ? "inherit" : LIGHT_GREY }}
            onClick={() => handleDirectoryChange()}
          >
            {fromDir || "Ordner auswählen..."}
          </Button>
        </InnerDiv>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <IconButton
          ref={continueButton}
          style={{ margin: "1em auto 1em auto", width: 140 }}
          onClick={handleContinueClick}
        >
          WEITER
          <ArrowForwardIosIcon style={{ fontSize: "1.1em" }} />
        </IconButton>
      </OuterDiv>
    </ContainerDiv>
  );
};

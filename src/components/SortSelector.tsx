import React, { FC, useContext, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Headline, IconButton } from "../util/smallComponents";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { AppContext } from "./AppContextProvider";
import { Pages } from "../Pages";

const LIGHT_GREY = "#dfdfdf";

const OuterDiv = styled.div`
  align-items: center;
  text-align: center;
  display: grid;
`;

const InnerDiv = styled.div`
  display: grid;
  gap: 6px;
`;

const ErrorMessage = styled.span`
  margin-top: 2em;
`;

export const SortSelector: FC = () => {
  const { fromDir, setFromDir, toDir, setToDir, setPage } = useContext(
    AppContext
  );
  const [errorMessage, setErrorMessage] = useState("");
  const continueButton = useRef(null);

  const handleDirectoryChange = (fromOrTo: "from" | "to") => {
    window.electron.dialog
      .showOpenDialog({
        filters: [{ name: "Folders" }],
        properties: ["openFile", "openDirectory", "promptToCreate"]
      })
      .then(result => {
        if (!result.canceled) {
          const path = result.filePaths[0].replace(/\\/g, "/");
          if (fromOrTo === "from") {
            setFromDir(path);
          } else {
            setToDir(path);
          }
        }
      });
  };

  const handleContinueClick = () => {
    let newErrorMessage = "";
    setErrorMessage("");
    if (fromDir === "") {
      newErrorMessage = "Aus welchem Ordner möchtest du kopieren?";
    } else if (toDir === "") {
      newErrorMessage = "In welchen Ordner möchtest du kopieren?";
    } else if (fromDir === toDir) {
      newErrorMessage = "Die Ordner müssen sich unterscheiden.";
    }

    if (newErrorMessage) {
      setErrorMessage(newErrorMessage);
      shakeContinue();
    } else {
      setPage(Pages.SORT);
    }
  };

  const shakeContinue = () => {
    continueButton.current.style.animation = "none";
    continueButton.current.focus();
    continueButton.current.style.animation = "shake 0.5s";
  };

  return (
    <OuterDiv>
      <Headline>Kopiere meine Bilder</Headline>
      <InnerDiv>
        <span>von</span>
        <Button
          style={{ color: fromDir ? "inherit" : LIGHT_GREY }}
          onClick={() => handleDirectoryChange("from")}
        >
          {fromDir || "Ordner auswählen..."}
        </Button>
        <span>nach</span>
        <Button
          style={{ color: toDir ? "inherit" : LIGHT_GREY }}
          onClick={() => handleDirectoryChange("to")}
        >
          {toDir || "Ordner auswählen..."}
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
  );
};

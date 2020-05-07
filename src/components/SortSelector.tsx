import React, { FC, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Headline, IconButton } from "../util/smallComponents";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

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
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
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
          const path = result.filePaths[0];
          if (fromOrTo === "from") {
            setFromPath(path);
          } else {
            setToPath(path);
          }
        }
      });
  };

  const handleContinueClick = () => {
    let newErrorMessage = "";
    setErrorMessage("");
    if (fromPath === "") {
      newErrorMessage = "Aus welchem Ordner möchtest du kopieren?";
    } else if (toPath === "") {
      newErrorMessage = "In welchen Ordner möchtest du kopieren?";
    } else if (fromPath === toPath) {
      newErrorMessage = "Die Ordner müssen sich unterscheiden.";
    }

    setErrorMessage(newErrorMessage);
    newErrorMessage && shakeContinue();
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
          style={{ color: fromPath ? "inherit" : LIGHT_GREY }}
          onClick={() => handleDirectoryChange("from")}
        >
          {fromPath || "Ordner auswählen..."}
        </Button>
        <span>nach</span>
        <Button
          style={{ color: toPath ? "inherit" : LIGHT_GREY }}
          onClick={() => handleDirectoryChange("to")}
        >
          {toPath || "Ordner auswählen..."}
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

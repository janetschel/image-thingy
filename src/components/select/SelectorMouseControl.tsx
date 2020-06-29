import React, { FC, useRef } from "react";
import styled from "styled-components";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import Redo from "@material-ui/icons/Redo";
import Undo from "@material-ui/icons/Undo";
import SaveIcon from "@material-ui/icons/Save";
import { BLUE } from "../../util/constants";
import { HidingButton } from '../HidingButton';

const StyledDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: grid;
  grid-template-columns: repeat(9, minmax(auto, 1fr));
  grid-auto-rows: 1fr;
  grid-template-areas:
    "left . . . . . . . right"
    "left . . . . . . . right"
    "left . . . . . . . right"
    "left . . . . . . . right"
    "left . . rotateLeft copy rotateRight . . right";
  opacity: 0;
  transition: opacity 0.4s;
`;

const iconStyle = {
  color: "white",
  filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5)"
};

const smallIconStyle = {
  ...iconStyle,
  fontSize: 70
};

const largeIconStyle = {
  ...iconStyle,
  fontSize: 120
};

interface SelectorMouseControlProps {
  handleRotateLeft: () => void;
  handleRotateRight: () => void;
  handlePrevious: () => void;
  handleCopyOrDelete: () => Promise<void>;
  handleNext: () => void;
}

export const SelectorMouseControl: FC<SelectorMouseControlProps> = ({
  handlePrevious,
  handleNext,
  handleRotateLeft,
  handleRotateRight,
  handleCopyOrDelete
}) => {
  const containerDiv = useRef(null);

  return (
    <StyledDiv ref={containerDiv}>
      <HidingButton
        style={{ gridArea: "left" }}
        title="Vorheriges Bild (A)"
        onClick={handlePrevious}
      >
        <NavigateBefore style={largeIconStyle} />
      </HidingButton>
      <HidingButton
        style={{ gridArea: "right" }}
        title="Nächstes Bild (D)"
        onClick={handleNext}
      >
        <NavigateNext style={largeIconStyle} />
      </HidingButton>
      <HidingButton
        style={{ gridArea: "rotateLeft" }}
        title="Linksdrehen (Q)"
        onClick={handleRotateLeft}
      >
        <Undo style={smallIconStyle} />
      </HidingButton>
      <HidingButton
        style={{ gridArea: "rotateRight" }}
        title="Rechtsdrehen (E)"
        onClick={handleRotateRight}
      >
        <Redo style={smallIconStyle} />
      </HidingButton>
      <HidingButton
        style={{ gridArea: "copy" }}
        title="Kopieren (Leertaste)"
        onClick={handleCopyOrDelete}
      >
        <SaveIcon style={{ ...smallIconStyle, color: BLUE }} />
      </HidingButton>
    </StyledDiv>
  );
};

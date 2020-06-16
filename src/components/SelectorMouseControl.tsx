import React, { FC, useRef } from "react";
import styled from "styled-components";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import Redo from "@material-ui/icons/Redo";
import Undo from "@material-ui/icons/Undo";
import SaveIcon from "@material-ui/icons/Save";
import { BLUE } from "../util/constants";

const StyledDiv = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  display: grid;
  grid-template-columns: repeat(9, minmax(auto, 1fr));
  grid-auto-rows: 1fr;
  grid-template-areas:
    "h h h h h h h h h"
    ". . . . . . . . ."
    "left . . . . . . . right"
    ". . . . . . . . ."
    ". . . rotateLeft copy rotateRight . . .";
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

  const HidingButton: FC<React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >> = props => {
    const showControls = () => {
      containerDiv.current.style.opacity = 1;
    };

    const hideControls = () => {
      containerDiv.current.style.opacity = 0;
    };

    return (
      <button
        {...props}
        onMouseEnter={showControls}
        onMouseLeave={hideControls}
        style={{
          ...props.style,
          background: "none",
          cursor: "pointer",
          border: "none"
        }}
      >
        {props.children}
      </button>
    );
  };

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

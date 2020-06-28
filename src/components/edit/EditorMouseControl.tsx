import React, {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import Redo from "@material-ui/icons/Redo";
import Undo from "@material-ui/icons/Undo";
import SaveIcon from "@material-ui/icons/Save";
import { BLUE } from "../../util/constants";
import { HidingButton } from "../HidingButton";
import ExposureIcon from "@material-ui/icons/Exposure";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import HighQualityIcon from "@material-ui/icons/HighQuality";
import TonalityIcon from "@material-ui/icons/Tonality";
import IsoIcon from "@material-ui/icons/Iso";
import { Slider } from "@material-ui/core";
import { EditorContext } from "./EditorContext";
import Icon from "@material-ui/core/Icon";

const StyledDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: grid;
  grid-template-columns: repeat(9, minmax(auto, 1fr));
  grid-auto-rows: 1fr;
  grid-template-areas:
    "left . . . . . edit edit right"
    "left . . . . . edit edit right"
    "left . . . . . edit edit right"
    "left . . . . . edit edit right"
    "left . . . save . . . right";
  opacity: 1; //TODO
  transition: opacity 0.4s;
`;

const SliderContainerContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const SliderContainer = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: min-content 1fr;
  grid-gap: 10px;
`;

const StyledSlider = styled(Slider)`
  margin: auto;
  color: white !important;
`;

const editIconStyle = {
  cursor: "pointer",
  color: BLUE,
  fontSize: "2em",
  margin: "auto",
};

const iconStyle = {
  color: "white",
  filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5)",
};

const smallIconStyle = {
  ...iconStyle,
  fontSize: 70,
};

const largeIconStyle = {
  ...iconStyle,
  fontSize: 120,
};

interface EditorMouseControlProps {
  handlePrevious: () => void;
  handleNext: () => void;
}

export const EditorMouseControl: FC<EditorMouseControlProps> = ({
  handlePrevious,
  handleNext,
}) => {
  const {
    brighten,
    setBrighten,
    saturate,
    setSaturate,
    expose,
    setExpose,
    sharpen,
    setSharpen,
    contrast,
    setContrast,
    gamma,
    setGamma,
  } = useContext(EditorContext);

  const [brightenState, setBrightenState] = useState<number>(0);
  const [saturateState, setSaturateState] = useState<number>(0);
  const [exposeState, setExposeState] = useState<number>(0);
  const [sharpenState, setSharpenState] = useState<number>(0);
  const [contrastState, setContrastState] = useState<number>(0);
  const [gammaState, setGammaState] = useState<number>(0);

  const handleBrightenChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setBrightenState(value as number);
  };
  const handleBrightenCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setBrighten(value as number);
  };
  const handleSaturateChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setSaturateState(value as number);
  };
  const handleSaturateCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setSaturate(value as number);
  };
  const handleExposeChange = (event: ChangeEvent, value: number | number[]) => {
    setExposeState(value as number);
  };
  const handleExposeCommit = (event: ChangeEvent, value: number | number[]) => {
    setExpose(value as number);
  };
  const handleSharpenChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setSharpenState(value as number);
  };
  const handleSharpenCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setSharpen(value as number);
  };
  const handleContrastChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setContrastState(value as number);
  };
  const handleContrastCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    setContrast(value as number);
  };
  const handleGammaChange = (event: ChangeEvent, value: number | number[]) => {
    setGammaState(value as number);
  };
  const handleGammaCommit = (event: ChangeEvent, value: number | number[]) => {
    setGamma(value as number);
  };

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
      <SliderContainerContainer style={{ gridArea: "edit" }}>
        <SliderContainer>
          <Brightness7Icon
            style={editIconStyle}
            onClick={() => {
              setBrighten(0);
              setBrightenState(0);
            }}
          />
          <StyledSlider
            min={-100}
            max={100}
            value={brightenState}
            onChange={handleBrightenChange}
            onChangeCommitted={handleBrightenCommit}
          />
          <InvertColorsIcon
            style={editIconStyle}
            onClick={() => {
              setSaturate(0);
              setSaturateState(0);
            }}
          />
          <StyledSlider
            min={-100}
            max={100}
            value={saturateState}
            onChange={handleSaturateChange}
            onChangeCommitted={handleSaturateCommit}
          />
          <ExposureIcon
            style={editIconStyle}
            onClick={() => {
              setExpose(0);
              setExposeState(0);
            }}
          />
          <StyledSlider
            min={-100}
            max={100}
            value={exposeState}
            onChange={handleExposeChange}
            onChangeCommitted={handleExposeCommit}
          />
          <HighQualityIcon
            style={editIconStyle}
            onClick={() => {
              setSharpen(0);
              setSharpenState(0);
            }}
          />
          <StyledSlider
            min={0}
            max={100}
            value={sharpenState}
            onChange={handleSharpenChange}
            onChangeCommitted={handleSharpenCommit}
          />
          <TonalityIcon
            style={editIconStyle}
            onClick={() => {
              setContrast(0);
              setContrastState(0);
            }}
          />
          <StyledSlider
            min={-100}
            max={100}
            value={contrastState}
            onChange={handleContrastChange}
            onChangeCommitted={handleContrastCommit}
          />
          <IsoIcon
            style={editIconStyle}
            onClick={() => {
              setGamma(0);
              setGammaState(0);
            }}
          />
          <StyledSlider
            min={-100}
            max={100}
            value={gammaState}
            onChange={handleGammaChange}
            onChangeCommitted={handleGammaCommit}
          />
        </SliderContainer>
      </SliderContainerContainer>
      <HidingButton
        style={{ gridArea: "right" }}
        title="Nächstes Bild (D)"
        onClick={handleNext}
      >
        <NavigateNext style={largeIconStyle} />
      </HidingButton>
      <HidingButton style={{ gridArea: "save" }} title="Speichern">
        <SaveIcon style={{ ...smallIconStyle, color: BLUE }} />
      </HidingButton>
    </StyledDiv>
  );
};

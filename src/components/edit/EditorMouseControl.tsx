import React, {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import styled from "styled-components";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import SaveIcon from "@material-ui/icons/Save";
import { BLUE } from "../../util/constants";
import { HidingButton } from "../HidingButton";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { Slider, TooltipProps } from "@material-ui/core";
import { EditorContext } from "./EditorContext";
import Tooltip from "@material-ui/core/Tooltip";
import { FaThermometerHalf } from "react-icons/fa";
import {
  MdBrightnessMedium,
  MdExposure,
  MdHighQuality,
  MdInvertColors
} from "react-icons/md";
import { IoMdContrast } from "react-icons/io";
import { RiDropLine } from "react-icons/ri";

const StyledDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: grid;
  grid-template-columns: repeat(9, minmax(auto, 1fr));
  grid-auto-rows: 1fr;
  grid-template-areas:
    "left . . edit edit edit edit edit right"
    "left . . edit edit edit edit edit right"
    "left . . edit edit edit edit edit right"
    "left . . edit edit edit edit edit right"
    "left . . . save . . . right";
  opacity: 0;
  transition: opacity 0.4s;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));
`;

const SliderContainerContainer = styled.div`
  height: 100%;
  width: 500px;
  display: flex;
  align-items: center;
  align-self: end;
  margin-left: auto;
`;

const SliderContainer = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: min-content 1fr;
  grid-gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
`;

const StyledSlider = styled(Slider)`
  margin: auto;
  color: white !important;
`;

const editIconStyle = {
  cursor: "pointer",
  color: BLUE,
  fontSize: "2em"
};

const IconTooltip: FC<TooltipProps> = ( props) => {
  return (
    <Tooltip {...props}>
      <div style={{ margin: "auto" }}>{props.children}</div>
    </Tooltip>
  );
};

const iconStyle = {
  color: "white"
};

const smallIconStyle = {
  ...iconStyle,
  fontSize: 70
};

const largeIconStyle = {
  ...iconStyle,
  fontSize: 120
};

interface EditorMouseControlProps {
  disabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
}

export const EditorMouseControl: FC<EditorMouseControlProps> = ({
  disabled,
  onPrevious: handlePrevious,
  onNext: handleNext,
  onSave: handleSave
}) => {
  const {
    brightenValue,
    setBrightenValue,
    saturateValue,
    setSaturateValue,
    exposeValue,
    setExposeValue,
    sharpenValue,
    setSharpenValue,
    contrastValue,
    setContrastValue,
    gammaValue,
    setGammaValue,
    temperatureValue,
    setTemperatureValue,
    redAdjustValue,
    setRedAdjustValue,
    greenAdjustValue,
    setGreenAdjustValue,
    blueAdjustValue,
    setBlueAdjustValue
  } = useContext(EditorContext);

  const containerDiv = useRef<HTMLDivElement>(null);

  const [brightenState, setBrightenState] = useState<number>(0);
  const [saturateState, setSaturateState] = useState<number>(0);
  const [exposeState, setExposeState] = useState<number>(0);
  const [sharpenState, setSharpenState] = useState<number>(0);
  const [contrastState, setContrastState] = useState<number>(0);
  const [gammaState, setGammaState] = useState<number>(0);
  const [temperatureState, setTemperatureState] = useState<number>(0);
  const [redAdjustState, setRedAdjustState] = useState<number>(0);
  const [greenAdjustState, setGreenAdjustState] = useState<number>(0);
  const [blueAdjustState, setBlueAdjustState] = useState<number>(0);

  useEffect(() => {
    setBrightenState(brightenValue);
  }, [brightenValue]);
  useEffect(() => {
    setSaturateState(saturateValue);
  }, [saturateValue]);
  useEffect(() => {
    setExposeState(exposeValue);
  }, [exposeValue]);
  useEffect(() => {
    setSharpenState(sharpenValue);
  }, [sharpenValue]);
  useEffect(() => {
    setContrastState(contrastValue);
  }, [contrastValue]);
  useEffect(() => {
    setGammaState(gammaValue);
  }, [gammaValue]);
  useEffect(() => {
    setTemperatureState(temperatureValue);
  }, [temperatureValue]);
  useEffect(() => {
    setRedAdjustState(redAdjustValue);
  }, [redAdjustValue]);
  useEffect(() => {
    setGreenAdjustState(greenAdjustValue);
  }, [greenAdjustValue]);
  useEffect(() => {
    setBlueAdjustState(blueAdjustValue);
  }, [blueAdjustValue]);

  const handleBrightenChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setBrightenState(value as number);
  };
  const handleBrightenCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setBrightenValue(value as number);
  };
  const handleSaturateChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setSaturateState(value as number);
  };
  const handleSaturateCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setSaturateValue(value as number);
  };
  const handleExposeChange = (event: ChangeEvent, value: number | number[]) => {
    setExposeState(value as number);
  };
  const handleExposeCommit = (event: ChangeEvent, value: number | number[]) => {
    !disabled && setExposeValue(value as number);
  };
  const handleSharpenChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setSharpenState(value as number);
  };
  const handleSharpenCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setSharpenValue(value as number);
  };
  const handleContrastChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setContrastState(value as number);
  };
  const handleContrastCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setContrastValue(value as number);
  };
  const handleGammaChange = (event: ChangeEvent, value: number | number[]) => {
    !disabled && setGammaState(value as number);
  };
  const handleGammaCommit = (event: ChangeEvent, value: number | number[]) => {
    !disabled && setGammaValue(value as number);
  };
  const handleTemperatureChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setTemperatureState(value as number);
  };
  const handleTemperatureCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setTemperatureValue(value as number);
  };
  const handleRedAdjustChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setRedAdjustState(value as number);
  };
  const handleRedAdjustCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setRedAdjustValue(value as number);
  };
  const handleGreenAdjustChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setGreenAdjustState(value as number);
  };
  const handleGreenAdjustCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setGreenAdjustValue(value as number);
  };
  const handleBlueAdjustChange = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setBlueAdjustState(value as number);
  };
  const handleBlueAdjustCommit = (
    event: ChangeEvent,
    value: number | number[]
  ) => {
    !disabled && setBlueAdjustValue(value as number);
  };

  const showControls = () => {
    containerDiv.current.style.opacity = "1";
  };

  const hideControls = () => {
    containerDiv.current.style.opacity = "0";
  };

  return (
    <StyledDiv ref={containerDiv}>
      <SliderContainerContainer style={{ gridArea: "edit" }}>
        <SliderContainer
          onMouseEnter={showControls}
          onMouseLeave={hideControls}
        >
          <IconTooltip title="Helligkeit">
            <MdBrightnessMedium
              style={editIconStyle}
              onClick={() => {
                setBrightenValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={brightenState}
            onChange={handleBrightenChange}
            onChangeCommitted={handleBrightenCommit}
          />
          <IconTooltip title="Sättigung">
            <MdInvertColors
              style={editIconStyle}
              onClick={() => {
                setSaturateValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={saturateState}
            onChange={handleSaturateChange}
            onChangeCommitted={handleSaturateCommit}
          />
          <IconTooltip title="Belichtung">
            <WbSunnyIcon
              style={editIconStyle}
              onClick={() => {
                setExposeValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={exposeState}
            onChange={handleExposeChange}
            onChangeCommitted={handleExposeCommit}
          />
          <IconTooltip title="Schärfe">
            <MdHighQuality
              style={editIconStyle}
              onClick={() => {
                setSharpenValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={0}
            max={100}
            value={sharpenState}
            onChange={handleSharpenChange}
            onChangeCommitted={handleSharpenCommit}
          />
          <IconTooltip title="Kontrast">
            <IoMdContrast
              style={editIconStyle}
              onClick={() => {
                setContrastValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={contrastState}
            onChange={handleContrastChange}
            onChangeCommitted={handleContrastCommit}
          />
          <IconTooltip title="Gamma">
            <MdExposure
              style={editIconStyle}
              onClick={() => {
                setGammaValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={gammaState}
            onChange={handleGammaChange}
            onChangeCommitted={handleGammaCommit}
          />
          <IconTooltip title="Temperatur">
            <FaThermometerHalf
              style={editIconStyle}
              onClick={() => {
                setTemperatureValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={temperatureState}
            onChange={handleTemperatureChange}
            onChangeCommitted={handleTemperatureCommit}
          />
          <IconTooltip title="Rot">
            <RiDropLine
              style={{...editIconStyle, color: "red"}}
              onClick={() => {
                setRedAdjustValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={redAdjustState}
            onChange={handleRedAdjustChange}
            onChangeCommitted={handleRedAdjustCommit}
          />
          <IconTooltip title="Grün">
            <RiDropLine
              style={{...editIconStyle, color: "green"}}
              onClick={() => {
                setGreenAdjustValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={greenAdjustState}
            onChange={handleGreenAdjustChange}
            onChangeCommitted={handleGreenAdjustCommit}
          />
          <IconTooltip title="Blau">
            <RiDropLine
              style={{...editIconStyle, color: "blue"}}
              onClick={() => {
                setBlueAdjustValue(0);
              }}
            />
          </IconTooltip>
          <StyledSlider
            min={-100}
            max={100}
            value={blueAdjustState}
            onChange={handleBlueAdjustChange}
            onChangeCommitted={handleBlueAdjustCommit}
          />
        </SliderContainer>
      </SliderContainerContainer>

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
        onClick={handleSave}
        style={{ gridArea: "save" }}
        title="Speichern"
      >
        <SaveIcon style={{ ...smallIconStyle, color: BLUE }} />
      </HidingButton>
    </StyledDiv>
  );
};

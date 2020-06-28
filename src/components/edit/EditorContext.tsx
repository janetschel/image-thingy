import React, { createContext, FC, useEffect, useState } from "react";
import { Filtrr2 } from "../../filtrr2/filtrr2";

interface Context {
  brightenValue: number;
  setBrightenValue: (brighten: number) => void;
  saturateValue: number;
  setSaturateValue: (saturateValue: number) => void;
  exposeValue: number;
  setExposeValue: (exposeValue: number) => void;
  sharpenValue: number;
  setSharpenValue: (sharpenValue: number) => void;
  contrastValue: number;
  setContrastValue: (contrastValue: number) => void;
  gammaValue: number;
  setGammaValue: (gammaValue: number) => void;
  temperatureValue: number;
  setTemperatureValue: (temperatureValue: number) => void;
  reset: () => void;
}

export const EditorContext = createContext<Context>({
  brightenValue: 0,
  setBrightenValue: () => {},
  saturateValue: 0,
  setSaturateValue: () => {},
  exposeValue: 0,
  setExposeValue: () => {},
  sharpenValue: 0,
  setSharpenValue: () => {},
  contrastValue: 0,
  setContrastValue: () => {},
  gammaValue: 0,
  setGammaValue: () => {},
  temperatureValue: 0,
  setTemperatureValue: () => {},
  reset: () => {}
});

export const EditorContextProvider: FC = ({ children }) => {
  const [brightenValue, setBrightenValue] = useState<number>(0);
  const [saturateValue, setSaturateValue] = useState<number>(0);
  const [exposeValue, setExposeValue] = useState<number>(0);
  const [sharpenValue, setSharpenValue] = useState<number>(0);
  const [contrastValue, setContrastValue] = useState<number>(0);
  const [gammaValue, setGammaValue] = useState<number>(0);
  const [temperatureValue, setTemperatureValue] = useState<number>(0);

  const reset = () => {
    setBrightenValue(0);
    setSaturateValue(0);
    setExposeValue(0);
    setSharpenValue(0);
    setContrastValue(0);
    setGammaValue(0);
    setTemperatureValue(0);
  };

  return (
    <EditorContext.Provider
      value={{
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
        reset
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

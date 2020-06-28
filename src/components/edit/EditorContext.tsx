import React, { createContext, FC, useEffect, useState } from "react";
import { Filtrr2 } from "../../filtrr2/filtrr2";

interface Context {
  brighten: number;
  setBrighten: (brighten: number) => void;
  saturate: number;
  setSaturate: (saturate: number) => void;
  expose: number;
  setExpose: (expose: number) => void;
  sharpen: number;
  setSharpen: (sharpen: number) => void;
  contrast: number;
  setContrast: (contrast: number) => void;
  gamma: number;
  setGamma: (gamma: number) => void;
}

export const EditorContext = createContext<Context>({
  brighten: 0,
  setBrighten: () => {},
  saturate: 0,
  setSaturate: () => {},
  expose: 0,
  setExpose: () => {},
  sharpen: 0,
  setSharpen: () => {},
  contrast: 0,
  setContrast: () => {},
  gamma: 0,
  setGamma: () => {},
});

export const EditorContextProvider: FC = ({ children }) => {
  const [brighten, setBrighten] = useState<number>(0);
  const [saturate, setSaturate] = useState<number>(0);
  const [expose, setExpose] = useState<number>(0);
  const [sharpen, setSharpen] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [gamma, setGamma] = useState<number>(0);

  return (
    <EditorContext.Provider
      value={{
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
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

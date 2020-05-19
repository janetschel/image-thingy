import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { AppContext } from "./AppContextProvider";
import styled from "styled-components";
import { Beenhere } from "@material-ui/icons";
import { BLUE } from "../util/constants";
import { loadImageNames, rotateImage } from "../util/functions";
import { Directions } from "../util/enums";

const fs = require("fs");
const { getColorFromURL } = require("color-thief-node");

const CheckIcon = styled(Beenhere)`
  position: absolute;
  top: 6px;
  right: 0;
  font-size: 100px !important;
  color: ${BLUE};
  z-index: 2;
`;

export const ImageSelector: FC = () => {
  const { fromDir, toDir } = useContext(AppContext);
  const [counter, setCounter] = useState<number>(0);
  const [exists, setExists] = useState<boolean>(false);
  const [toDirContent, setToDirContent] = useState<Array<string>>(
    loadImageNames(toDir)
  );
  const fromDirContent = useRef<Array<string>>(loadImageNames(fromDir));
  const containerDiv = useRef<HTMLDivElement>(null);
  const [imageToDisplay, setImageToDisplay] = useState<{
    src: string;
    timestamp: number;
  }>({ src: "", timestamp: Date.now() });

  useEffect(() => {
    const path = `${fromDir}/${fromDirContent.current[counter]}`;

    setExists(toDirContent.includes(fromDirContent.current[counter]));

    getColorFromURL(path).then(color => {
      containerDiv.current.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]}`;
    });

    setImageToDisplay({ src: path, timestamp: Date.now() });
  }, [toDirContent, counter]);

  const copyOrDelete = useCallback(
    async (fromPath: string, toPath: string) => {
      if (exists) {
        fs.unlinkSync(toPath);
      } else {
        fs.copyFileSync(fromPath, toPath);
      }
      setToDirContent(loadImageNames(toDir));
    },
    [exists]
  );

  const decreaseCounter = useCallback(() => {
    setCounter(prev => (prev > 0 ? prev - 1 : prev));
  }, [setCounter]);

  const increaseCounter = useCallback(() => {
    setCounter(prev =>
      prev < fromDirContent.current.length - 1 ? prev + 1 : prev
    );
  }, [setCounter]);

  const handleRotate = useCallback(
    (path: string, direction: Directions) => {
      rotateImage(path, direction).then(() =>
        setImageToDisplay({ src: path, timestamp: Date.now() })
      );
    },
    [setImageToDisplay]
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const fromPath = `${fromDir}/${fromDirContent.current[counter]}`;
      const toPath = `${toDir}/${fromDirContent.current[counter]}`;
      switch (event.key) {
        case "a":
          decreaseCounter();
          break;
        case "d":
          increaseCounter();
          break;
        case "q":
          handleRotate(fromPath, Directions.LEFT);
          break;
        case "e":
          handleRotate(fromPath, Directions.RIGHT);
          break;
        case " ":
          copyOrDelete(fromPath, toPath);
      }
    },
    [increaseCounter, handleRotate, copyOrDelete, counter]
  );

  return (
    <div
      ref={containerDiv}
      style={{
        width: "100%",
        height: "100%",
        textAlign: "center"
      }}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      {exists && <CheckIcon />}
      <img
        src={`${imageToDisplay.src}?${imageToDisplay.timestamp}`}
        alt="Das Bild kann nicht angezeigt werden"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain"
        }}
      />
    </div>
  );
};

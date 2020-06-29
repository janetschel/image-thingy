import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContextProvider";
import styled from "styled-components";
import { Beenhere } from "@material-ui/icons";
import { BLUE, HEADER_HEIGHT } from "../../util/constants";
import {loadImageNames, prefixIfOnUnixSystems, rotateImage} from "../../util/functions";
import { Directions } from "../../util/enums";
import { SelectorMouseControl } from "./SelectorMouseControl";

const fs = require("fs");
const { getColorFromURL } = require("color-thief-node");

const CheckIcon = styled(Beenhere)`
  position: absolute;
  top: 6px;
  right: 0;
  font-size: 100px !important;
  color: ${BLUE};
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
  const fromPath = useRef("");
  const toPath = useRef("");
  const [imageToDisplay, setImageToDisplay] = useState<{
    src: string;
    timestamp: number;
  }>({ src: "", timestamp: Date.now() });

  useEffect(() => {
    fromPath.current = `${fromDir}/${fromDirContent.current[counter]}`;
    toPath.current = `${toDir}/${fromDirContent.current[counter]}`;

    setExists(toDirContent.includes(fromDirContent.current[counter]));
    getColorFromURL(`${prefixIfOnUnixSystems()}${fromPath.current}`).then(color => {
      containerDiv.current.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]}`;
    });
    setImageToDisplay({ src: fromPath.current, timestamp: Date.now() });
  }, [
    containerDiv,
    setExists,
    fromDir,
    toDir,
    fromPath,
    toPath,
    fromDirContent,
    toDirContent,
    counter
  ]);

  const handleRotate = (path: string, direction: Directions) => {
    rotateImage(path, direction).then(() =>
      setImageToDisplay({ src: path, timestamp: Date.now() })
    );
  };

  const copyOrDelete = async (fromPath: string, toPath: string) => {
    if (exists) {
      fs.unlinkSync(toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
    setToDirContent(loadImageNames(toDir));
  };

  const handlePrevious = () => setCounter(prev => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCounter(prev =>
      prev < fromDirContent.current.length - 1 ? prev + 1 : prev
    );
  const handleRotateLeft = () =>
    handleRotate(fromPath.current, Directions.LEFT);
  const handleRotateRight = () =>
    handleRotate(fromPath.current, Directions.RIGHT);
  const handleCopyOrDelete = () =>
    copyOrDelete(fromPath.current, toPath.current);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "a":
        handlePrevious();
        break;
      case "d":
        handleNext();
        break;
      case "q":
        handleRotateLeft();
        break;
      case "e":
        handleRotateRight();
        break;
      case " ":
        handleCopyOrDelete();
    }
  };

  return (
    <div
      ref={containerDiv}
      style={{
        width: "100%",
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
        textAlign: "center",
        position: "relative"
      }}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      {exists && <CheckIcon />}
      <img
        src={`${prefixIfOnUnixSystems()}${imageToDisplay.src}?${imageToDisplay.timestamp}`}
        alt="Das Bild kann nicht angezeigt werden"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain"
        }}
      />
      <SelectorMouseControl
        {...{
          handlePrevious,
          handleNext,
          handleRotateLeft,
          handleRotateRight,
          handleCopyOrDelete
        }}
      />
    </div>
  );
};

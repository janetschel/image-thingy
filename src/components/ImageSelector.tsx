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
import { loadImageNames } from "../util/functions";
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
  const [imageName, setImageName] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [exists, setExists] = useState<boolean>(false);
  const fromDirContent = useRef(loadImageNames(fromDir));
  const [toDirContent, setToDirContent] = useState<Array<string>>(
    loadImageNames(toDir)
  );
  const containerDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageName(`${fromDirContent.current[counter]}`);
  }, [counter]);

  useEffect(() => {
    setExists(toDirContent.includes(imageName));
  }, [toDirContent, imageName]);

  useEffect(() => {
    imageName &&
      fs.existsSync(`${fromDir}\\${imageName}`) &&
      getColorFromURL(`${fromDir}\\${imageName}`).then(color => {
        containerDiv.current.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]}`;
      });
  }, [imageName]);

  const copyOrDelete = useCallback(() => {
    if (exists) {
      fs.unlinkSync(`${toDir}\\${imageName}`);
    } else {
      fs.copyFileSync(`${fromDir}\\${imageName}`, `${toDir}\\${imageName}`);
    }
    setToDirContent(loadImageNames(toDir));
  }, [imageName, exists]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "a":
        decreaseCounter();
        break;
      case "d":
        increaseCounter();
        break;
      case " ":
        copyOrDelete();
    }
  };

  const decreaseCounter = () => {
    setCounter(prev => (prev > 0 ? prev - 1 : prev));
  };
  const increaseCounter = () => {
    setCounter(prev =>
      prev < fromDirContent.current.length - 1 ? prev + 1 : prev
    );
  };

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
      {imageName && fs.existsSync(`${fromDir}\\${imageName}`) && (
        <img
          src={`${fromDir}\\${imageName}`}
          alt="Das Bild kann nicht angezeigt werden"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
};

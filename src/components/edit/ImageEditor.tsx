import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContextProvider";
import styled from "styled-components";
import { Beenhere } from "@material-ui/icons";
import { BLUE, HEADER_HEIGHT } from "../../util/constants";
import { loadImageNames, rotateImage } from "../../util/functions";
import { Directions } from "../../util/enums";
import { SelectorMouseControl } from "../select/SelectorMouseControl";
import { EditorMouseControl } from "./EditorMouseControl";

const fs = require("fs");
import { Filtrr2 } from "../../filtrr2/filtrr2";
import { EditorContext } from "./EditorContext";
const { getColorFromURL } = require("color-thief-node");

export const ImageEditor: FC = () => {
  const { fromDir } = useContext(AppContext);
  const { brighten, saturate, expose, sharpen, contrast, gamma } = useContext(
    EditorContext
  );
  const [counter, setCounter] = useState<number>(0);
  const fromDirContent = useRef<Array<string>>(loadImageNames(fromDir));
  const containerDiv = useRef<HTMLDivElement>(null);
  const [imageToDisplay, setImageToDisplay] = useState<string>(
    `${fromDir}/${fromDirContent.current[0]}`
  );

  useEffect(() => {
    const fromPath = `${fromDir}/${fromDirContent.current[counter]}`;
    setImageToDisplay(fromPath);

    getColorFromURL(fromPath).then((color) => {
      containerDiv.current.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]}`;
    });
  }, [containerDiv, fromDir, fromDirContent, counter]);

  const handlePrevious = () =>
    setCounter((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCounter((prev) =>
      prev < fromDirContent.current.length - 1 ? prev + 1 : prev
    );

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "a":
        handlePrevious();
        break;
      case "d":
        handleNext();
        break;
      case " ":
        /**const hm = document.getElementById("filtrr2-main-image");
        if (hm) {
          hm.remove();
        }**/
        Filtrr2("#main-image", function () {
          this.brighten(brighten)
            .saturate(saturate)
            .expose(expose)
            .sharpen(sharpen)
            .contrast(contrast)
            .gamma(gamma)
            .render();
        });
        break;
    }
  };

  return (
    <div
      ref={containerDiv}
      style={{
        width: "100%",
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
        textAlign: "center",
        position: "relative",
      }}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <img
        src={imageToDisplay}
        alt="Das Bild kann nicht angezeigt werden"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        id="main-image"
      />
      <EditorMouseControl
        {...{
          handlePrevious,
          handleNext,
        }}
      />
    </div>
  );
};

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { AppContext } from "../AppContextProvider";
import { HEADER_HEIGHT } from "../../util/constants";
import {loadImageNames} from "../../util/functions";
import { EditorMouseControl } from "./EditorMouseControl";
import { Filtrr2 } from "../../filtrr2/filtrr2";
import { EditorContext } from "./EditorContext";

const fs = require("fs");
const nativeImage = require("electron").nativeImage;
const { getColorFromURL } = require("color-thief-node");

export const ImageEditor: FC = () => {
  const { fromDir } = useContext(AppContext);
  const {
    brightenValue,
    saturateValue,
    exposeValue,
    sharpenValue,
    contrastValue,
    gammaValue,
    temperatureValue,
    reset
  } = useContext(EditorContext);
  const [counter, setCounter] = useState<number>(0);
  const fromDirContent = useRef<Array<string>>(loadImageNames(fromDir));
  const imagePath = useRef("");
  const fileEnding = useRef("");
  const imageContainer = useRef<HTMLDivElement>(null);
  const saveCanvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(true);
  const imageId = "main-image";
  const initialRun = useRef(true);

  const placeImage = useCallback(() => {
    setReady(false);

    const timestampedPath = `file://${imagePath.current}?${new Date().getTime()}`;

    const image = new Image();
    image.src = timestampedPath;
    image.alt = "Das Bild kann nicht angezeigt werden";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    image.id = imageId;

    reset();

    getColorFromURL(timestampedPath).then(color => {
      imageContainer.current.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]}`;
    });

    document.getElementById(imageId)?.remove();
    document.getElementById(`filtrr2-${imageId}`)?.remove();

    imageContainer.current.append(image);

    setReady(true);
  }, []);

  useEffect(() => {
    const imageName = fromDirContent.current[counter];

    fileEnding.current = imageName.split(".")[1];
    imagePath.current = `${fromDir}/${imageName}`;

    placeImage();
  }, [fromDirContent, counter]);

  const executeFiltrr2 = useCallback(
    (imageId: string, done?: () => void) => {
      Filtrr2(
        `#${imageId}`,
        function() {
          if (brightenValue) {
            this.brighten(brightenValue / 3.0);
          }
          if (saturateValue) {
            this.saturate(saturateValue);
          }
          if (exposeValue) {
            this.expose(exposeValue / 3.3);
          }
          if (sharpenValue) {
            this.sharpen(sharpenValue);
          }
          if (contrastValue) {
            this.contrast(contrastValue / 3.3);
          }
          if (gammaValue) {
            this.gamma(gammaValue / 20.0);
          }
          if (temperatureValue) {
            this.temperature(temperatureValue / 5.0);
          }
          this.render(() => {
            if (done) {
              done();
            }
          });
        },
        {
          store: false
        }
      );
    },
    [
      brightenValue,
      saturateValue,
      exposeValue,
      sharpenValue,
      contrastValue,
      gammaValue,
      temperatureValue
    ]
  );

  useEffect(() => {
    if (!initialRun.current) {
      setReady(false);
      const imageElement = document.getElementById(imageId);
      const filtrr2CanvasElement = document.getElementById(
        `filtrr2-${imageId}`
      );

      imageElement.style.display = "unset";
      filtrr2CanvasElement?.remove();

      executeFiltrr2(imageId, () => setReady(true));
    } else {
      initialRun.current = false;
    }
  }, [
    executeFiltrr2,
    brightenValue,
    saturateValue,
    exposeValue,
    sharpenValue,
    contrastValue,
    gammaValue,
    temperatureValue
  ]);

  const handlePrevious = () => setCounter(prev => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCounter(prev =>
      prev < fromDirContent.current.length - 1 ? prev + 1 : prev
    );

  const handleSave = () => {
    setReady(false);
    const image = new Image();

    let mediaType;
    switch (fileEnding.current) {
      case "jpg":
      case "jpeg":
        mediaType = "image/jpeg";
        break;
      case "png":
        mediaType = "image/png";
        break;
      default:
        throw new Error("Unbekannte Dateiendung");
    }

    image.src = `file://${imagePath.current}?${new Date().getTime()}`;
    image.onload = () => {
      saveCanvas.current.width = image.width;
      saveCanvas.current.height = image.height;
      saveCanvas.current.getContext("2d").drawImage(image, 0, 0);
      executeFiltrr2("save-canvas", () => {
        const dataURL = saveCanvas.current.toDataURL(mediaType);
        const imageToSave = nativeImage.createFromDataURL(dataURL);
        let imageData;

        switch (mediaType) {
          case "image/jpeg":
            imageData = imageToSave.toJPEG(100);
            break;
          case "image/png":
            imageData = imageToSave.toPNG();
        }

        fs.writeFileSync(imagePath.current, imageData);

        placeImage();
      });
    };
  };

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (ready) {
        switch (event.key) {
          case "a":
            handlePrevious();
            break;
          case "d":
            handleNext();
            break;
        }
      }
    },
    []
  );

  return (
    <>
      <canvas
        ref={saveCanvas}
        id="save-canvas"
        style={{ position: "absolute", display: "none" }}
      />
      <div
        ref={imageContainer}
        style={{
          width: "100%",
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
          textAlign: "center",
          position: "relative"
        }}
        onKeyPress={handleKeyPress}
        tabIndex={0}
      >
        {/**<img> or <canvas> rendered here**/}
        <EditorMouseControl
          disabled={!ready}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

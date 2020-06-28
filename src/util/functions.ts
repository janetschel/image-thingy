import { EXTENSIONS } from "./constants";
import { Directions } from "./enums";
import { MutableRefObject } from "react";

const fs = require("fs");
const { ipcRenderer } = require("electron");
const nativeImage = require("electron").nativeImage;

export const loadImageNames = (directory: string) =>
  fs.readdirSync(directory).filter(element => {
    const splitFileName = element.split(".");
    return (
      splitFileName.length == 2 &&
      EXTENSIONS.includes(splitFileName[1].toLowerCase())
    );
  });

//Use this to get the image size if you want to rotate them using CSS
export const calcImageMultiplicator = async (
  path: string,
  available: { width: number; height: number },
  rotated: boolean
): Promise<{ width: number; height: number }> => {
  const dimensions: {
    width: number;
    height: number;
  } = await ipcRenderer.invoke("get-image-dimensions", path);

  const imageWidth = rotated ? dimensions.height : dimensions.width;
  const imageHeight = rotated ? dimensions.width : dimensions.height;

  let mul;

  if (
    Math.abs(available.width - imageWidth) <
    Math.abs(available.height - imageHeight)
  ) {
    mul = available.width / imageWidth;
  } else {
    mul = available.height / imageHeight;
  }

  return { width: imageWidth * mul, height: imageHeight * mul };
};

export const rotateImage = async (path, direction: Directions) => {
  const fileExtension = path.split(".")[1].toLowerCase();
  const image = nativeImage.createFromPath(path);
  const size = image.getSize();
  const bitmap = image.getBitmap();
  const resultBuffer = rotate90degrees(
    bitmap,
    size,
    direction === Directions.LEFT
  );

  const resultImage = nativeImage.createFromBuffer(resultBuffer, {
    width: size.height,
    height: size.width
  });

  let imageData;
  switch (fileExtension) {
    case "png":
      imageData = resultImage.toPNG();
      break;
    case "jpg":
    case "jpeg":
      imageData = resultImage.toJPEG(100);
      break;
    default:
      throw Error("Unbekannte Dateiendung");
  }

  return fs.writeFileSync(path, imageData);
};

const rotate90degrees = (bitmap, size, counterClockwise) => {
  const dstBuffer = Buffer.alloc(bitmap.length);
  const dstOffsetStep = counterClockwise ? -4 : 4;
  let dstOffset = counterClockwise ? bitmap.length - 4 : 0;

  let tmp: number;
  let srcOffset;

  for (let x = 0; x < size.width; x++) {
    for (let y = size.height - 1; y >= 0; y--) {
      srcOffset = (size.width * y + x) << 2;
      tmp = bitmap.readUInt32BE(srcOffset);
      dstBuffer.writeUInt32BE(tmp, dstOffset);
      dstOffset += dstOffsetStep;
    }
  }

  return dstBuffer;
};

export const shakeButton = (button: MutableRefObject<HTMLButtonElement>) => {
  button.current.style.animation = "none";
  button.current.focus();
  button.current.style.animation = "shake 0.5s";
};

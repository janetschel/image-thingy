import { EXTENSIONS } from "./constants";

const fs = require("fs");

export const loadImageNames = (directory: string) =>
  fs
    .readdirSync(directory)
    .filter(element => EXTENSIONS.includes(element.split(".")[1]));

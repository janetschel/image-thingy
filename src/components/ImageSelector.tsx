import React, {
  FC,
  useContext,
  useRef,
  useState
} from "react";
import { AppContext } from "./AppContextProvider";
const fs = require("fs");
const exec = require("child_process").exec;

export const ImageSelector: FC = () => {
  const { fromDir, toDir } = useContext(AppContext);
  const [counter, setCounter] = useState<number>(0);
  const dirContent = useRef(fs.readdirSync(fromDir));
  const containerDiv = useRef(null);

  const copy = () => {
    exec(
      `copy /y "${fromDir}\\${dirContent.current[counter]}" "${toDir}"`,
      (error, stdout, stderr) => {}
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "a":
        decreaseCounter();
        break;
      case "d":
        increaseCounter();
        break;
      case " ":
        copy();
    }
  };

  const decreaseCounter = () => {
    setCounter(prev => (prev > 0 ? prev - 1 : prev));
  };
  const increaseCounter = () => {
    setCounter(prev =>
      prev < dirContent.current.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div
      ref={containerDiv}
      style={{ width: "100%", height: "100%", textAlign: "center" }}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <img
        src={`${fromDir}/${dirContent.current[counter]}`}
        alt="fuck"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

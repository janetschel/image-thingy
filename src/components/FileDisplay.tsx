import React, { FC, useState } from "react";

export const FileDisplay: FC = () => {
  const [image, setImage] = useState<string | null>(null);
  return (
    <div>
      <button
        onClick={() =>
          window.electron.dialog
            .showOpenDialog({
              filters: [{ name: "Images", extensions: ["jpg", "png"] }],
              properties: ["openFile", "promptToCreate"]
            })
            .then(result => {
              setImage(result.filePaths[0]);
            })
        }
      >
        Bild ändern
      </button>
      {image && <img src={image} alt="fuck" style={{ width: "100%" }} />}
    </div>
  );
};

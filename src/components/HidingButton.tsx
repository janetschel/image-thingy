import React, { FC, useRef } from "react";

interface HidingButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const HidingButton: FC<HidingButtonProps> = (props) => {
  const hidingButton = useRef<HTMLButtonElement>(null);
  const showControls = () => {
    (hidingButton.current.parentNode as HTMLDivElement).style.opacity = "1";
  };

  const hideControls = () => {
    (hidingButton.current.parentNode as HTMLDivElement).style.opacity = "0";
  };

  return (
    <button
      ref={hidingButton}
      {...props}
      onMouseEnter={showControls}
      onMouseLeave={hideControls}
      style={{
        ...props.style,
        background: "none",
        cursor: "pointer",
        border: "none",
      }}
    >
      {props.children}
    </button>
  );
};

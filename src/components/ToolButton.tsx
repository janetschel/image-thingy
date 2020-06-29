import React, { FC } from "react";
import styled from "styled-components";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { BLUE } from "../util/constants";

const OuterDiv = styled.div`
  height: 80px;
  display: grid;
  grid-template-columns: 1fr 60px;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: color 0.1s linear, background-color 0.1s linear;

  &:hover {
    background-color: ${BLUE};
    color: white;
  }
`;

interface ToolButtonProps {
  text: string;
  onClick: () => void;
}

export const ToolButton: FC<ToolButtonProps> = ({
  text,
  onClick: handleClick
}) => {
  return (
    <OuterDiv onClick={handleClick}>
      <span style={{paddingLeft: 40}}>{text}</span>
      <ArrowForwardIosIcon style={{ width: 40, height: 40 }} />
    </OuterDiv>
  );
};

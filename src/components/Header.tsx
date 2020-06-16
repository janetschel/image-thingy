import React, { FC } from "react";
import {BLUE, HEADER_HEIGHT} from "../util/constants";
import styled from "styled-components";
import ArrowBack from "@material-ui/icons/ArrowBack";

const StyledDiv = styled.div`
  background-color: ${BLUE};
  height: ${HEADER_HEIGHT}px;
  width: 100%;
`;

const StyledButton = styled.button`
  width: min-content;
  height: min-content;
  background: none;
  cursor: pointer;
  border: none;
`;

export const Header: FC<{ onBackClick: () => void }> = ({
  onBackClick: handleBackClick
}) => {
  return (
    <StyledDiv>
      <StyledButton onClick={handleBackClick}>
        <ArrowBack style={{ color: "white" }} />
      </StyledButton>
    </StyledDiv>
  );
};

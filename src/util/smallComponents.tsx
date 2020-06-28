import styled from "styled-components";
import { BLUE } from "./constants";
import React, { FC, MutableRefObject } from "react";

export const Headline = styled.span`
  font-size: 150%;
  text-align: center;
  padding: 1em 0 1em 0;
  display: inline-block;
`;

export const Button = styled.div`
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.1s linear, color 0.1s linear;
  text-align: center;

  &:hover {
    background-color: ${BLUE};
    color: white !important;
  }
`;

export const IconButton = styled(Button)`
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr min-content;
`;

import styled from "styled-components";
import { BLUE } from "./constants";

export const Headline = styled.span`
  font-size: 150%;
  text-align: center;
  margin: 1em 0 1em 0;
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

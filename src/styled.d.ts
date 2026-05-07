// This file augments styled-components' DefaultTheme so our custom
// theme shape is recognized across all styled-components in the project.
import "styled-components";
import { Theme } from "./styles/GlobalStyles";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

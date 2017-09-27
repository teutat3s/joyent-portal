import { css } from 'styled-components';
import { fonts, loadedFontFamily, unloadedFontFamily } from '../typography';

export default ({ theme }) => css`
  ${fonts.libreFranklin.normal};
  ${fonts.libreFranklin.medium};
  ${fonts.libreFranklin.semibold};

  [hidden] {
    display: none;
  }

  html {
    line-height: 1.15;
    text-size-adjust: 100%;
  }

  body {
    font-size: 15px;
    margin: 0;
    padding: 0;
    background: ${theme.background};

    ${unloadedFontFamily};
  }

  html, body, #root {
    height: 100%;
  }

  .fonts-loaded body {
    ${loadedFontFamily};
  }

  .CodeMirror, .ReactCodeMirror {
    height: 100% !important;
  }

  .CodeMirror {
    border: solid 1px ${theme.grey};
  }
`;

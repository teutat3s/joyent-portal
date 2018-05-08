import React from 'react';

import calcFill from './fill';
export default ({
  fill = null,
  light = false,
  disabled = false,
  colors = {},
  ...rest
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" {...rest}>
    <title>Artboard 1 copy 11</title>
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M21.05 3.4c-9.9 0-18 7.9-18 17.5A17.69 17.69 0 0 0 11 35.5V20.7a10.2 10.2 0 0 1 10-10.2 10.18 10.18 0 0 1 10 10.4 10.25 10.25 0 0 1-10 10.4 9.6 9.6 0 0 1-5.8-1.9v8.2a18.53 18.53 0 0 0 5.8.9c9.9 0 18-7.9 18-17.5A17.76 17.76 0 0 0 21.05 3.4"
    />
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M27.15 21.2a6 6 0 1 1-6-6 6 6 0 0 1 6 6"
    />
  </svg>
);

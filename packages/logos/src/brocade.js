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
    <title>Artboard 1 copy 14</title>
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M37.38 20a7.62 7.62 0 0 0 2.7-5.7 7.38 7.38 0 0 0-7.4-7.4H4.08c7.3 7.4 14.3 11.2 19.8 13.1-5.5 1.9-12.4 5.7-19.8 13.1h28.6a7.38 7.38 0 0 0 7.4-7.4 7.12 7.12 0 0 0-2.7-5.7m-5 9.1h-17.2c6.49-4.6 12.1-6.8 17.1-6.8a3.37 3.37 0 0 1 3.4 3.4 3.43 3.43 0 0 1-3.3 3.4m0-11.4c-5 0-10.61-2.2-17.11-6.8h17.11a3.37 3.37 0 0 1 3.4 3.4 3.59 3.59 0 0 1-3.4 3.4"
    />
  </svg>
);

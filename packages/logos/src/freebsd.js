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
    <title>Artboard 1 copy 3</title>
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M35.66 6.09c1.6 1.6-2.8 8.6-3.6 9.3s-2.6.1-4.2-1.5-2.3-3.5-1.5-4.2 7.7-5.2 9.3-3.6m-22.3 1.7c-2.4-1.4-5.9-2.9-7-1.8s.5 4.6 1.9 7.1a14.41 14.41 0 0 1 5.1-5.3"
    />
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M33.26 14.89c.2.8.2 1.4-.2 1.7-.8.8-3.1-.1-5.2-2l-.4-.4a9.12 9.12 0 0 1-1.7-2.3c-.7-1.3-.9-2.4-.4-3a1.57 1.57 0 0 1 1.4-.3c.4-.2.8-.5 1.3-.8a15 15 0 0 0-6.7-1.6 14.4 14.4 0 1 0 14.4 14.4 14.21 14.21 0 0 0-1.9-7.1 4.54 4.54 0 0 1-.6 1.4"
    />
  </svg>
);

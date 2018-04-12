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
    <title>Artboard 1 copy 13</title>
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M39.91 3s-.6-2.5-2.4-2.1a18.78 18.78 0 0 0-4.6 2.3c-.1.1-.3.2-.4.3-.5.4-1.1.7-1.7 1.2l-2.1 1.5c-.7.5-1.3 1-2 1.6s-1.2.9-1.8 1.4l-.1.1-.1.1-1.9 1.6c-.6.6-1.3 1.2-1.9 1.7s-1.1 1-1.6 1.5l-.3.3c-.6.7-1.2 1.3-1.8 1.9s-1.2 1.4-1.7 2c-.3.4-.7.9-1 1.3a4.13 4.13 0 0 0-.7 1.1c-.6.8-1.1 1.7-1.6 2.5v.1a31.82 31.82 0 0 0-1.6 3.2v.1a8 8 0 0 0-1.4-2.4 12 12 0 0 1 .5 5.2 5.33 5.33 0 0 1-2.1-1.1 5 5 0 0 0 1.5 1.8 7 7 0 0 0-3.1.4 5.22 5.22 0 0 1 3.3.5c-2.3 3-4.8 6.3-7.3 9.9a1.05 1.05 0 0 0 .9-.5c.5-.6 3.4-4.9 7.7-10.4a1.76 1.76 0 0 1 .4-.5l.1-.1c.5-.6.9-1.2 1.4-1.8.1-.1.2-.3.3-.4l1.3-1.6c.1-.2.3-.3.4-.5.6-.7 1.1-1.4 1.7-2.1l1.7-2c.6-.7 1.2-1.3 1.8-2s1.2-1.4 1.8-2 1.2-1.3 1.9-2a4.62 4.62 0 0 1 .7-.7l1.2-1.2.1-.1c.6-.6 1.2-1.2 1.9-1.8s1.3-1.2 2-1.8 1.4-1.2 2-1.8l.1-.1c.7-.5 1.3-1.1 2-1.6a31 31 0 0 1 4.1-2.6.31.31 0 0 1 .2-.1c-.1 0-.1.1-.2.1a31.09 31.09 0 0 0-3.9 2.7c-.6.5-1.3 1-2 1.6l-.1.1c-.6.5-1.3 1.1-2 1.8s-1.3 1.2-2 1.9l-1.9 1.9-.3.3-.8.8-.9.9c-.1.2-.3.3-.4.5a19.2 19.2 0 0 1-1.4 1.5c-.6.6-1.2 1.3-1.8 2s-1.2 1.3-1.8 2l-1.8 2.1c-.5.6-1.1 1.3-1.6 2l-.1.1c-.5.7-1.1 1.4-1.7 2.1-.1.1-.2.2-.2.3-.4.6-.9 1.1-1.3 1.7-.1.1-.1.2-.2.2-.3.4-.6.7-1.2 1.6a4.64 4.64 0 0 1 .8 2 2.87 2.87 0 0 0-.3-2.2c2.5 1 4.9 1 6.6-.4.2-.1.3-.3.5-.4a2.61 2.61 0 0 1-2.6.1 7.33 7.33 0 0 0 4.4-1.7 6.47 6.47 0 0 0 .9-.8 6 6 0 0 1-5.8 0h-.1a11.59 11.59 0 0 0 6.4-1.2 14.83 14.83 0 0 0 2.7-1.9 20.32 20.32 0 0 0 2-2.1 23.05 23.05 0 0 0 1.8-2.3 3.78 3.78 0 0 1-1.5 0h-.6a6.57 6.57 0 0 0 4.4-2.1 6.84 6.84 0 0 1-2.2.2.76.76 0 0 1-.4-.1H27a8.58 8.58 0 0 0 1.7-.3c.1 0 .2-.1.3-.1s.3-.1.5-.2.2-.1.3-.2a2.65 2.65 0 0 0 .6-.5l.2-.2.2-.2a7.3 7.3 0 0 0 .9-1 1.38 1.38 0 0 1 .3-.4c0-.1.1-.1.1-.2s.2-.3.3-.4a1.38 1.38 0 0 1 .3-.4c-.1 0-.1 0-.2.1a8.09 8.09 0 0 1-2.2 0h-.2a6.29 6.29 0 0 0 3.1-1.1 4.23 4.23 0 0 1 .7-.5l2.1-1.8c.6-.6 1.2-1.3 1.7-1.8.3-.4.6-.7.8-1a5.58 5.58 0 0 1 .5-.8c1.41-2.88.91-4.6.91-4.6z"
    />
  </svg>
);

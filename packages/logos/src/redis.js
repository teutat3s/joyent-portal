import React from 'react';

import calcFill from './fill';
export default ({
  fill = null,
  light = false,
  disabled = false,
  colors = {},
  ...rest
}) => (
  <svg
    id="svg4300"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 42 42"
    {...rest}
  >
    <defs>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '.cls-1,.cls-2{fill:#fff}.cls-1{opacity:.25;isolation:isolate}.cls-3{fill:#333}'
        }}
      />
    </defs>
    <title>Artboard 1 copy 20</title>
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M37.57 23.65c-1.9-.7-11.8-4.6-13.7-5.3s-2.7-.7-4.9.1-12.8 4.9-14.6 5.7c-.9.4-1.4.7-1.4 1.1H3v3.6c0 .4.5.7 1.5 1.2 1.9.9 12.5 5.2 14.2 6s2.9.8 5-.3 12.1-5.2 14-6.2c1-.5 1.4-.9 1.4-1.3v-3.6c-.1-.4-.53-.65-1.53-1z"
    />
    <path
      className="cls-1"
      d="M37.57 25.85c-1.9 1-11.9 5.1-14 6.2s-3.3 1.1-5 .3-12.3-5.1-14.2-6-1.9-1.5-.1-2.3 12.4-4.9 14.6-5.7 3-.8 4.9-.1 11.8 4.6 13.7 5.3 2 1.3.1 2.3z"
    />
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M37.57 17.75c-1.9-.7-11.8-4.6-13.7-5.3s-2.7-.7-4.9.1-12.8 4.9-14.6 5.7c-.9.4-1.4.7-1.4 1.1H3V23c0 .4.5.7 1.5 1.2 1.9.9 12.5 5.2 14.2 6s2.9.8 5-.3 12.1-5.2 14-6.2c1-.5 1.4-.9 1.4-1.3v-3.6c-.1-.35-.53-.75-1.53-1.05z"
    />
    <path
      className="cls-1"
      d="M37.57 20c-1.9 1-11.9 5.1-14 6.2s-3.3 1.1-5 .3-12.3-5.1-14.2-6-1.9-1.5-.1-2.3 12.4-4.9 14.6-5.7 3-.8 4.9-.1 11.8 4.6 13.7 5.3 2 1.3.1 2.3z"
    />
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M37.57 11.55c-1.9-.7-11.8-4.6-13.7-5.3s-2.7-.7-4.9.1-12.8 4.9-14.6 5.7c-.9.4-1.4.7-1.4 1.1H3v3.6c0 .4.5.7 1.5 1.2 1.9.9 12.5 5.2 14.2 6s2.9.8 5-.3 12.1-5.2 14-6.2c1-.5 1.4-.9 1.4-1.3v-3.6c-.1-.3-.53-.7-1.53-1z"
    />
    <path
      className="cls-1"
      d="M37.57 13.75c-1.9 1-11.9 5.1-14 6.2s-3.3 1.1-5 .3-12.3-5.1-14.2-6-1.9-1.5-.1-2.3 12.4-4.9 14.6-5.7 3-.8 4.9-.1 11.8 4.6 13.7 5.3 2 1.3.1 2.3z"
    />
    <path
      className="cls-2"
      d="M25.77 10.25l-3.2.4-.7 1.6-1.1-1.8-3.6-.4 2.7-.9-.8-1.5 2.5 1 2.4-.8-.7 1.5 2.5.9zm-4.1 8.2l-5.8-2.4 8.4-1.3-2.6 3.7z"
    />
    <ellipse className="cls-2" cx="13.67" cy="12.95" rx="4.5" ry="1.7" />
    <path
      fill={calcFill({ fill, disabled, light, colors })}
      d="M29.37 10.75l5 1.9-5 2v-3.9z"
    />
    <path className="cls-3" d="M23.97 12.95l5.4-2.2v3.9l-.5.2-4.9-1.9z" />
  </svg>
);

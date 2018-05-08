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
      <style dangerouslySetInnerHTML={{ __html: '.cls-1{fill:#fff}' }} />
    </defs>
    <title>Artboard 1</title>
    <g id="g12802">
      <g id="g12804">
        <g id="g12806">
          <path
            fill={calcFill({ fill, disabled, light, colors })}
            d="M18.54 19.68l1.3 1.32-1.3 1.28h-9.2v4.38L3.74 21l5.6-5.54v4.26z"
            id="path12808"
          />
        </g>
      </g>
    </g>
    <g id="g12768">
      <g id="g12770">
        <g id="g12772">
          <path
            fill={calcFill({ fill, disabled, light, colors })}
            d="M22.76 18.17l-1.28 1.3-1.28-1.3V9h-4.37l5.65-5.6L27 9h-4.24v9.2z"
            id="path12774"
          />
        </g>
      </g>
    </g>
    <g id="g12780">
      <g id="g12782">
        <path
          fill={calcFill({ fill, disabled, light, colors })}
          d="M24.23 22.29L22.93 21l1.3-1.28h9.2v-4.36L39 21l-5.6 5.55v-4.26z"
          id="path12784"
        />
      </g>
    </g>
    <g id="g12790">
      <g id="g12792">
        <g id="g12794">
          <path
            fill={calcFill({ fill, disabled, light, colors })}
            d="M20.05 23.86l1.28-1.3 1.28 1.3v9.2H27l-5.65 5.6-5.55-5.6h4.27z"
            id="path12796"
          />
        </g>
      </g>
    </g>
    <g id="rect12744">
      <path
        fill={calcFill({ fill, disabled, light, colors })}
        d="M9 8.6h11.2v11.2H9z"
      />
      <path
        className="cls-1"
        d="M20.63 20.2H8.73V8.3h11.9zm-11.2-.8h10.4V9H9.43z"
      />
    </g>
    <g id="rect12746">
      <path
        fill={calcFill({ fill, disabled, light, colors })}
        d="M22.63 8.6h11.2v11.2h-11.2z"
      />
      <path
        className="cls-1"
        d="M34.13 20.2h-11.9V8.3h11.9zm-11.2-.8h10.4V9h-10.4z"
      />
    </g>
    <g id="rect12748">
      <path
        fill={calcFill({ fill, disabled, light, colors })}
        d="M22.63 22.2h11.2v11.2h-11.2z"
      />
      <path
        className="cls-1"
        d="M34.13 33.7h-11.9V21.8h11.9zm-11.2-.7h10.4V22.6h-10.4z"
      />
    </g>
    <g id="rect12750">
      <path
        fill={calcFill({ fill, disabled, light, colors })}
        d="M9 22.2h11.2v11.2H9z"
      />
      <path
        className="cls-1"
        d="M20.63 33.7H8.73V21.8h11.9zM9.43 33h10.4V22.6H9.43z"
      />
    </g>
    <path
      className="cls-1"
      d="M11.83 29.4L3.43 21l8.4-8.4 8.4 8.4zM4.43 21l7.4 7.4 7.4-7.4-7.4-7.4z"
      id="rect12760"
    />
    <path
      className="cls-1"
      d="M21.43 19.8L13 11.4 21.43 3l8.4 8.4zM14 11.4l7.4 7.4 7.4-7.4L21.43 4z"
      id="rect12762"
    />
    <path
      className="cls-1"
      d="M31 29.4L22.63 21 31 12.6l8.4 8.4zM23.63 21L31 28.4l7.4-7.4-7.4-7.4z"
      id="rect12764"
    />
    <path
      className="cls-1"
      d="M21.43 39L13 30.6l8.4-8.4 8.4 8.4zM14 30.6l7.4 7.4 7.4-7.4-7.4-7.4z"
      id="rect12766"
    />
  </svg>
);

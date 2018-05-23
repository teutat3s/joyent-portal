import React from 'react';

import Rotate from './rotate';

export default ({ direction = 'down', style = {}, ...rest }) => (
  <Rotate direction={direction}>
    {({ style: rotateStyle }) => (
      <svg
        width="119"
        height="109"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 119.34 109.47"
        style={{ ...style, ...rotateStyle }}
        {...rest}
      >
        <defs>
          <style
            dangerouslySetInnerHTML={{
              __html:
                '.cls-1{opacity:0.5;}.cls-2{fill:url(#radial-gradient);}.cls-3{fill:url(#radial-gradient-2);}.cls-4{fill:#fff;}.cls-5{fill:url(#radial-gradient-3);}.cls-6{fill:#1b3240;}.cls-7{fill:url(#radial-gradient-4);}'
            }}
          />
          <radialGradient
            id="radial-gradient"
            cx="208.79"
            cy="99.06"
            r="57.13"
            gradientTransform="translate(227.6 -122.69) rotate(102.18) scale(1 1.28)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.05" stopColor="#436275" />
            <stop offset="0.1" stopColor="#415f72" />
            <stop offset="0.13" stopColor="#3a5769" />
            <stop offset="0.16" stopColor="#2e4959" />
            <stop offset="0.19" stopColor="#1d3543" />
            <stop offset="0.19" stopColor="#1b3240" />
            <stop offset="0.26" stopColor="#1e3644" />
            <stop offset="0.32" stopColor="#274150" />
            <stop offset="0.39" stopColor="#365364" />
            <stop offset="0.43" stopColor="#436275" />
            <stop offset="0.49" stopColor="#3f5d6f" />
            <stop offset="0.56" stopColor="#324e5f" />
            <stop offset="0.65" stopColor="#1e3644" />
            <stop offset="0.66" stopColor="#1b3240" />
            <stop offset="0.85" stopColor="#1b3240" />
            <stop offset="0.9" stopColor="#2c4656" />
            <stop offset="0.95" stopColor="#436275" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-2"
            cx="59.15"
            cy="56.86"
            r="46.01"
            gradientTransform="matrix(-0.52, 0.85, -1.09, -0.66, 151.75, 43.43)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#436275" />
            <stop offset="0.1" stopColor="#426073" />
            <stop offset="0.13" stopColor="#3c5a6c" />
            <stop offset="0.16" stopColor="#344f61" />
            <stop offset="0.18" stopColor="#274050" />
            <stop offset="0.19" stopColor="#1b3240" />
            <stop offset="0.26" stopColor="#1e3644" />
            <stop offset="0.32" stopColor="#274150" />
            <stop offset="0.39" stopColor="#365364" />
            <stop offset="0.43" stopColor="#436275" />
            <stop offset="0.49" stopColor="#3f5d6f" />
            <stop offset="0.56" stopColor="#324e5f" />
            <stop offset="0.65" stopColor="#1e3644" />
            <stop offset="0.66" stopColor="#1b3240" />
            <stop offset="0.85" stopColor="#1b3240" />
            <stop offset="0.92" stopColor="#2c4656" />
            <stop offset={1} stopColor="#436275" />
          </radialGradient>
          <radialGradient
            id="radial-gradient-3"
            cx="-521.06"
            cy="366.16"
            r="32.44"
            gradientTransform="translate(353.22 -558.2) rotate(-21.55) scale(1 1.28)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#436275" />
            <stop offset="0.02" stopColor="#436275" stopOpacity="0.97" />
            <stop offset="0.34" stopColor="#436275" stopOpacity="0.55" />
            <stop offset="0.62" stopColor="#436275" stopOpacity="0.25" />
            <stop offset="0.85" stopColor="#436275" stopOpacity="0.07" />
            <stop offset={1} stopColor="#436275" stopOpacity={0} />
          </radialGradient>
          <radialGradient
            id="radial-gradient-4"
            cx="-136.43"
            cy="140.9"
            r="54.82"
            gradientTransform="translate(242.58 104.51) rotate(58.19) scale(1 0.7)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#436275" />
            <stop offset="0.58" stopColor="#436275" stopOpacity="0.4" />
            <stop offset={1} stopColor="#436275" stopOpacity={0} />
          </radialGradient>
        </defs>
        <title>Empty-state-illustration</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <g className="cls-1">
              <path
                className="cls-2"
                d="M80.06,4.35c-13.32-6.18-29.35-5.57-42.71.53S13.26,22.2,6.63,35.31C1.14,46.16-1.69,58.78,1.08,70.63,3.79,82.22,11.75,92.21,21.73,98.69s21.86,9.66,33.73,10.54c11.45.85,23.26-.43,33.68-5.27,19-8.83,31.51-30,30.09-50.91s-20.11-40-38.57-48.3Z"
              />
            </g>
            <g className="cls-1">
              <path
                className="cls-3"
                d="M91.49,23.42c-11.21-9.58-24.94-13-38.61-11.88A45.54,45.54,0,0,0,19,32.25a49.05,49.05,0,0,0-5.48,39.52,35.93,35.93,0,0,0,7.15,13.75C26,91.54,33.6,95,41.27,97.28a64.6,64.6,0,0,0,20.16,3,47.46,47.46,0,0,0,32-13.61,44.74,44.74,0,0,0,13.06-32.08,42.49,42.49,0,0,0-15-31.19Z"
              />
            </g>
            <circle className="cls-4" cx="23.53" cy="73.77" r="11.93" />
            <circle className="cls-5" cx="23.53" cy="73.77" r="11.93" />
            <circle className="cls-6" cx="61.95" cy="55.24" r="34.25" />
            <circle className="cls-7" cx="61.95" cy="55.24" r="34.25" />
          </g>
        </g>
      </svg>
    )}
  </Rotate>
);

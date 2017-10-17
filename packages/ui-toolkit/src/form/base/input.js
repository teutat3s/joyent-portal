import React from 'react';
import { Subscriber } from 'joy-react-broadcast';
import styled, { css } from 'styled-components';
import remcalc from 'remcalc';
import is, { isNot } from 'styled-is';
import PropTypes from 'prop-types';

import typography from '../../typography';
import { borderRadius, border } from '../../boxes';

const colorWithDisabled = props =>
  props.disabled ? props.theme.disabled : props.theme.text;

const colorWithDefaultValue = props =>
  props.value === props.defaultValue
    ? props.theme.disabled
    : colorWithDisabled(props);

const color = props =>
  props.defaultValue ? colorWithDefaultValue(props) : colorWithDisabled(props);

const height = props => (props.multiple ? 'auto' : remcalc(48));

const paddingTop = props => (props.multiple ? remcalc(20) : remcalc(13));

const style = css`
  box-sizing: border-box;

  width: 100%;
  height: ${height};

  margin-bottom: ${remcalc(8)};
  margin-top: ${remcalc(8)};
  padding: ${paddingTop} ${remcalc(18)};

  border-radius: ${borderRadius};
  background-color: ${props => props.theme.white};
  border: ${border.unchecked};

  ${is('disabled')`
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: ${props => props.theme.placeholder};
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: ${props => props.theme.placeholder};
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: ${props => props.theme.placeholder};
    }
  `};

  ${is('error')`
    border-color: ${props => props.theme.redDark}
  `};

  ${is('warning')`
    border-color: ${props => props.theme.orangeDark}
  `};

  ${is('success')`
    border-color: ${props => props.theme.greenDark}
  `};

  ${isNot('fluid')`
    max-width: ${remcalc(300)};
  `};

  ${is('mono')`
    font-family: monospace;
  `};

  ${is('marginless')`
    margin: 0;
  `};

  ${isNot('value')`
    text-overflow: ellipsis;
  `};

  font-size: ${remcalc(15)};
  line-height: normal !important;

  ${typography.normal};
  font-style: normal;
  font-stretch: normal;
  color: ${color};

  appearance: none;
  outline: 0;

  &:focus {
    border-color: ${props => props.theme.primary};
    outline: 0;
  }
`;

const BaseInput = Component => props => {
  const render = value => {
    const _value = value || {};
    const { input = {}, meta = {}, id = '' } = _value;

    const hasError = Boolean(props.error || _value.error || meta.error);
    const hasWarning = Boolean(props.warning || _value.warning || meta.warning);
    const hasSuccess = Boolean(props.success || _value.success || meta.success);

    const marginless = Boolean(props.marginless);
    const fluid = Boolean(props.fluid);
    const mono = Boolean(props.mono);

    return (
      <Component
        {...props}
        {...input}
        id={id}
        error={hasError}
        warning={hasWarning}
        success={hasSuccess}
        fluid={fluid}
        marginless={marginless}
        mono={mono}
      />
    );
  };

  return <Subscriber channel="input-group">{render}</Subscriber>;
};

BaseInput.propTypes = {
  error: PropTypes.bool,
  warning: PropTypes.bool
};

export default BaseInput;

export const Stylable = Component => {
  const stylable =
    typeof Component === 'string' ? styled[Component] : styled(Component);

  return stylable`
    ${style}
  `;
};

import React from 'react';
import is from 'styled-is';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BaseInput, { Stylable } from './base/input';

const TextareaInput = BaseInput(Stylable('textarea'));

const BaseTextarea = styled(TextareaInput)`
  position: relative;
  display: inline-flex;

  ${is('fluid')`
    flex: 1 1 auto;
    width: 100%;
    max-width: 100%;
  `};
`;

/**
 * @example ./usage-textarea.md
 */
const Textarea = ({ children, fluid, ...rest }) => (
  <BaseTextarea {...rest} fluid={fluid} type="textarea">
    {children}
  </BaseTextarea>
);

export default Textarea;

Textarea.propTypes = {
  /**
   * Is the Textarea disabled ?
   */
  disabled: PropTypes.bool
};

Textarea.defaultProps = {
  disabled: false
};

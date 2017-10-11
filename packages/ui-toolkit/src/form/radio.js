import styled from 'styled-components';
import React from 'react';
import remcalc from 'remcalc';

import BaseToggle from './base/toggle';
import Baseline from '../baseline';
import BaseInput from './base/input';
import typography from '../typography';

const Li = styled.li`
  list-style-type: none;
  ${typography.normal};
  display: flex;
  align-items: center;

  label {
    font-weight: 400;
  }
`;

const Ul = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${remcalc(8)};

  + label {
    margin-left: ${remcalc(26)};
    font-size: ${remcalc(13)};
  }
`;

const RadioItem = BaseInput(({ children, id, ...rest }) => (
  <Li {...rest}>{children}</Li>
));

const Radio = Baseline(
  BaseToggle({
    container: RadioItem,
    type: 'radio'
  })
);

/**
 * @example ./usage-radio.md
 */
export default ({ children, ...rest }) => <Radio {...rest}>{children}</Radio>;

export const RadioList = Baseline(Ul);

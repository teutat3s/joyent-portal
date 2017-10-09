import React from 'react';
import { Subscriber } from 'joy-react-broadcast';
import remcalc from 'remcalc';

import Label from '../label';

const StyledLabel = Label.extend`
  margin-right: ${remcalc(12)};
  font-weight: bold;
`;

export default props => {
  const render = value => {
    const { id = '' } = value || {};
    return <StyledLabel {...props} htmlFor={id} />;
  };

  return <Subscriber channel="input-group">{render}</Subscriber>;
};

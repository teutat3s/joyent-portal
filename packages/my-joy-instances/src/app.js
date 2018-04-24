import React from 'react';
import Helmet from 'react-helmet-async';

import { RootContainer } from 'joyent-ui-toolkit';
import Routes from '@root/routes';

export default () => (
  <RootContainer>
    <Helmet>
      <title>Instances</title>
    </Helmet>
    <Routes />
  </RootContainer>
);

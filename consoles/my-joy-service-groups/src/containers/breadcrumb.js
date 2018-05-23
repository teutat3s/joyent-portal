import React from 'react';
import paramCase from 'param-case';
import get from 'lodash.get';
import { Link } from 'react-router-dom';
import { Margin } from 'styled-components-spacing';

import { Breadcrumb, BreadcrumbItem } from 'joyent-ui-toolkit';

export default ({ match }) => {
  const serviceGroupId = get(match, 'params.sg');

  const links = [
    {
      name: 'Compute',
      pathname: '/'
    },
    {
      name: 'Service Groups',
      pathname: '/service-groups'
    }
  ]
    .concat(
      serviceGroupId && [
        {
          name: paramCase(serviceGroupId),
          pathname: `/service-groups/${serviceGroupId}`
        }
      ]
    )
    .filter(Boolean)
    .map(({ name, pathname }) => (
      <BreadcrumbItem key={name} to={pathname} component={Link}>
        <Margin horizontal="1" vertical="3">
          {name}
        </Margin>
      </BreadcrumbItem>
    ));

  return <Breadcrumb>{links}</Breadcrumb>;
};

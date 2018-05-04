/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { compose, graphql } from 'react-apollo';
import ReduxForm from 'declarative-redux-form';
import { set } from 'react-redux-values';
import { connect } from 'react-redux';
import { Margin } from 'styled-components-spacing';
import Flex, { FlexItem } from 'styled-flex-component';
import get from 'lodash.get';
import forceArray from 'force-array';

import { FirewallIcon, H3, Button, P } from 'joyent-ui-toolkit';

import {
  ToggleFirewallForm,
  ToggleInactiveForm,
  TagRules,
  DefaultRules
} from '@components/firewall';

import Title from '@components/create-instance/title';
import Description from '@components/description';
import Empty from '@components/empty';
import ListFwRules from '@graphql/list-fw-rules.gql';
import { Forms, Values } from '@root/constants';

const { IC_FW_F_ENABLED, IC_FW_F_INACTIVE } = Forms;
const { IC_FW_V_PROCEEDED, IC_TAG_V_TAGS } = Values;

const Firewall = ({
  defaultRules = [],
  tagRules = [],
  expanded = false,
  proceeded = false,
  loading = false,
  enabled = false,
  handleNext,
  handleEdit,
  step
}) => (
  <Fragment>
    <Title
      id={step}
      onClick={!expanded && !proceeded && handleEdit}
      collapsed={!expanded && !proceeded}
      icon={<FirewallIcon />}
    >
      Firewall
    </Title>
    {expanded ? (
      <Description>
        Cloud firewall rules secure instances by defining network traffic rules,
        controlling incoming and outgoing traffic. Enabling the firewall applies
        only rules which match your instance. Although these rules are created
        in the firewall console, the addition of tags can alter the firewall
        rules.{' '}
        <a
          target="__blank"
          href="https://docs.joyent.com/public-cloud/network/firewall"
          rel="noopener noreferrer"
        >
          Read more
        </a>
      </Description>
    ) : null}
    <Flex>
      <FlexItem>
        <ReduxForm
          form={IC_FW_F_ENABLED}
          destroyOnUnmount={false}
          forceUnregisterOnUnmount={true}
        >
          {props =>
            expanded ? (
              <Margin right={4}>
                <ToggleFirewallForm {...props} submitting={loading} left />
              </Margin>
            ) : null
          }
        </ReduxForm>
      </FlexItem>
      <FlexItem>
        <ReduxForm
          form={IC_FW_F_INACTIVE}
          destroyOnUnmount={false}
          forceUnregisterOnUnmount={true}
        >
          {props =>
            enabled && expanded && !loading ? (
              <ToggleInactiveForm {...props} />
            ) : null
          }
        </ReduxForm>
      </FlexItem>
    </Flex>
    {enabled &&
    expanded &&
    !loading &&
    !defaultRules.length &&
    !tagRules.length ? (
      <Margin top={4}>
        <Empty borderTop>
          Sorry, but we weren’t able to find any firewall rules.
        </Empty>
      </Margin>
    ) : null}
    {!loading && expanded && enabled && defaultRules.length ? (
      <Margin top={4}>
        <DefaultRules rules={defaultRules} />
      </Margin>
    ) : null}
    {!loading && expanded && enabled && tagRules.length ? (
      <Margin top={4}>
        <TagRules rules={tagRules} />
      </Margin>
    ) : null}
    {!loading &&
    expanded &&
    enabled &&
    (tagRules.length || defaultRules.length) ? (
      <Margin TOP={4}>
        <P>
          *Other firewall rules may apply as defined by wildcard(s), IP(s),
          subnet(s), tag(s) or VM(s). Please see{' '}
          <a
            href="https://apidocs.joyent.com/cloudapi/#firewall-rule-syntax"
            target="_blank"
            rel="noopener noreferrer"
          >
            firewall rule list
          </a>{' '}
          for more details.
        </P>
      </Margin>
    ) : null}
    {proceeded && !expanded ? (
      <Margin bottom={4}>
        <H3>{enabled ? 'Firewall enabled' : 'Firewall not enabled'}</H3>
      </Margin>
    ) : null}
    {expanded ? (
      <Margin top={4} bottom={7}>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </Margin>
    ) : proceeded ? (
      <Margin top={4} bottom={7}>
        <Button type="button" onClick={handleEdit} secondary>
          Edit
        </Button>
      </Margin>
    ) : null}
  </Fragment>
);

export default compose(
  connect(
    ({ form, values }, ownProps) => ({
      ...ownProps,
      proceeded: get(values, IC_FW_V_PROCEEDED, false),
      enabled: get(form, `${IC_FW_F_ENABLED}.values.enabled`, false),
      showInactive: get(form, `${IC_FW_F_INACTIVE}.values.inactive`, false),
      tags: get(values, IC_TAG_V_TAGS, [])
    }),
    (dispatch, { history }) => ({
      handleNext: () => {
        dispatch(set({ name: IC_FW_V_PROCEEDED, value: true }));
        return history.push(`/instances/~create/cns${history.location.search}`);
      },
      handleEdit: () => {
        dispatch(set({ name: IC_FW_V_PROCEEDED, value: true }));
        return history.push(
          `/instances/~create/firewall${history.location.search}`
        );
      }
    })
  ),
  graphql(ListFwRules, {
    options: ({ tags, expanded, enabled }) => ({
      ssr: false,
      fetchPolicy: expanded && enabled ? 'cache-first' : 'cache-only',
      variables: {
        tags: tags.map(({ name, value }) => ({ name, value }))
      }
    }),
    props: ({ ownProps, data }) => {
      const { showInactive } = ownProps;

      const {
        firewall_rules_create_machine = [],
        loading,
        error,
        refetch
      } = data;

      const rules = forceArray(firewall_rules_create_machine).filter(
        ({ enabled }) => enabled || showInactive
      );

      return {
        defaultRules: rules.filter(({ rule_obj = {} }) => rule_obj.isWildcard),
        tagRules: rules.filter(({ rule_obj = {} }) => rule_obj.tags.length),
        loading,
        error,
        refetch
      };
    }
  })
)(Firewall);

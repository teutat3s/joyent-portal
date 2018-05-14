import React from 'react';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Row, Col } from 'joyent-react-styled-flexboxgrid';
import styled, { withTheme } from 'styled-components';
import { Margin, Padding } from 'styled-components-spacing';
import titleCase from 'title-case';
import get from 'lodash.get';
import remcalc from 'remcalc';
import { Field } from 'redux-form';

import {
  Card,
  CardOutlet,
  Divider,
  ResetIcon,
  Button as BaseButton,
  H2 as BaseH2,
  Label,
  CopiableField,
  QueryBreakpoints,
  DotIcon,
  DeleteIcon,
  StartIcon,
  StopIcon,
  EditIcon,
  InstanceTypeIcon,
  Input,
  FormMeta,
  FormGroup
} from 'joyent-ui-toolkit';

import GLOBAL from '@state/global';

const { SmallOnly, Medium } = QueryBreakpoints;

const stateColor = {
  PROVISIONING: 'primary',
  RUNNING: 'green',
  STOPPING: 'grey',
  STOPPED: 'grey',
  DELETED: 'secondaryActive',
  FAILED: 'red'
};

const GreyLabel = styled(Label)`
  opacity: 0.5;
  padding-right: ${remcalc(3)};
`;

const TrimedLabel = styled(Label)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Flex = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;

  @media (max-width: ${remcalc(767)}) {
    display: block;
  }
`;

const Actionable = styled(Margin)`
  cursor: pointer;
`;

const VerticalDivider = styled.div`
  width: ${remcalc(1)};
  background: ${props => props.theme.grey};
  height: ${remcalc(24)};
  display: flex;
  align-self: flex-end;
  margin: 0 ${remcalc(12)};

  @media (max-width: ${remcalc(767)}) {
    display: none;
  }
`;

const H2 = styled(BaseH2)`
  margin: 0;
`;

const Button = styled(BaseButton)`
  margin-right: ${remcalc(6)};
`;

export const Meta = ({
  created,
  updated,
  state,
  brand,
  image,
  editingName,
  handleSubmit,
  editName,
  disabled,
  submitting,
  ...instance
}) => [
  <Row middle="xs">
    <Col xs={12}>
      <Margin bottom={1}>
        <H2>
          {editingName ? (
            <form onSubmit={handleSubmit}>
              <Flex style={{ alignItems: 'start' }}>
                <FormGroup name="name" field={Field}>
                  <Input
                    onBlur={null}
                    type="text"
                    placeholder={instance.name}
                    disabled={disabled || submitting}
                  />
                  <FormMeta />
                </FormGroup>
                <Margin left={1}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    loading={submitting}
                    inline
                  >
                    Save
                  </Button>
                </Margin>
              </Flex>
            </form>
          ) : (
            <Flex>
              {instance.name}
              <Actionable left={2} onClick={editName}>
                <EditIcon />
              </Actionable>
            </Flex>
          )}
        </H2>
      </Margin>
    </Col>
  </Row>,
  <Margin vertical={1}>
    <Flex>
      <TrimedLabel>
        {image && image.name ? titleCase(image.name) : 'Custom Image'}
      </TrimedLabel>
      <VerticalDivider />
      <TrimedLabel>
        {brand === 'LX'
          ? 'Infrastructure container'
          : 'Hardware virtual machine'}
      </TrimedLabel>
      <VerticalDivider />
      <TrimedLabel>{(instance.package || {}).name}</TrimedLabel>
      <VerticalDivider />
      <Flex>
        <DotIcon
          right={remcalc(6)}
          size={remcalc(15)}
          color={stateColor[state]}
        />
        {titleCase(state)}
      </Flex>
    </Flex>
    <Margin top={1}>
      <Flex>
        <Flex>
          <GreyLabel>Created: </GreyLabel>
          <Label> {distanceInWordsToNow(created)} ago</Label>
        </Flex>
        <VerticalDivider />
        <Flex>
          <GreyLabel>Updated: </GreyLabel>
          <Label> {distanceInWordsToNow(updated)} ago</Label>
        </Flex>
      </Flex>
    </Margin>
  </Margin>
];

export default withTheme(
  ({
    instance = {},
    starting = false,
    stopping = false,
    rebooting = false,
    removing = false,
    onAction,
    theme = {},
    ...props
  }) => (
    <Row>
      <Col xs={12} sm={12} md={9}>
        <Card>
          <CardOutlet>
            <Padding all={5}>
              <Meta {...instance} {...props} />
              <Margin top={3}>
                <Row between="xs">
                  <Col xs={9}>
                    <Button
                      href={`${GLOBAL.origin}/images/~create/${instance.id}`}
                      target="__blank"
                      rel="noopener noreferrer"
                      secondary
                      bold
                      small
                      icon
                    >
                      <Padding top={0.5}>
                        <InstanceTypeIcon />
                      </Padding>
                    </Button>
                    <SmallOnly>
                      <Button
                        href={`${GLOBAL.origin}/images/~create/${instance.id}`}
                        target="__blank"
                        rel="noopener noreferrer"
                        secondary
                        bold
                        small
                        icon
                      >
                        <Padding top={0}>
                          <InstanceTypeIcon />
                        </Padding>
                      </Button>
                    </SmallOnly>
                    <SmallOnly>
                      <Button
                        type="button"
                        loading={starting}
                        disabled={instance.state !== 'STOPPED'}
                        onClick={() => onAction('start')}
                        secondary
                        small
                        icon
                      >
                        <Margin right={2}>
                          <StartIcon disabled={instance.state !== 'STOPPED'} />
                        </Margin>
                      </Button>
                    </SmallOnly>
                    <Medium>
                      <Button
                        type="button"
                        loading={starting}
                        disabled={instance.state !== 'STOPPED'}
                        onClick={() => onAction('start')}
                        secondary
                        bold
                        icon
                      >
                        <Margin right={2}>
                          <StartIcon disabled={instance.state !== 'STOPPED'} />
                        </Margin>
                        <span>Start</span>
                      </Button>
                    </Medium>
                    <SmallOnly>
                      <Button
                        type="button"
                        loading={stopping}
                        disabled={instance.state !== 'RUNNING'}
                        onClick={() => onAction('stop')}
                        secondary
                        small
                        icon
                      >
                        <Margin right={2}>
                          <StopIcon disabled={instance.state !== 'RUNNING'} />
                        </Margin>
                      </Button>
                    </SmallOnly>
                    <Medium>
                      <Button
                        type="button"
                        loading={stopping}
                        disabled={instance.state !== 'RUNNING'}
                        onClick={() => onAction('stop')}
                        secondary
                        bold
                        icon
                      >
                        <Margin right={2}>
                          <StopIcon disabled={instance.state !== 'RUNNING'} />
                        </Margin>
                        <span>Stop</span>
                      </Button>
                    </Medium>
                    <SmallOnly>
                      <Button
                        type="button"
                        loading={rebooting}
                        disabled={instance.state !== 'RUNNING'}
                        onClick={() => onAction('reboot')}
                        secondary
                        small
                        icon
                      >
                        <Margin right={2}>
                          <ResetIcon disabled={instance.state !== 'RUNNING'} />
                        </Margin>
                      </Button>
                    </SmallOnly>
                    <Medium>
                      <Button
                        type="button"
                        loading={rebooting}
                        disabled={instance.state !== 'RUNNING'}
                        onClick={() => onAction('reboot')}
                        secondary
                        bold
                        icon
                      >
                        <Margin right={2}>
                          <ResetIcon disabled={instance.state !== 'RUNNING'} />
                        </Margin>
                        <span>Reboot</span>
                      </Button>
                    </Medium>
                  </Col>
                  <Col xs={3}>
                    <SmallOnly>
                      <Button
                        type="button"
                        loading={removing}
                        disabled={
                          ['RUNNING', 'STOPPED'].indexOf(instance.state) < 0
                        }
                        onClick={() => onAction('remove')}
                        secondary
                        small
                        right
                        icon
                        error
                      >
                        <Margin right={2}>
                          <DeleteIcon
                            fill={theme.red}
                            disabled={
                              ['RUNNING', 'STOPPED'].indexOf(instance.state) < 0
                            }
                          />
                        </Margin>
                      </Button>
                    </SmallOnly>
                    <Medium>
                      <Button
                        type="button"
                        loading={removing}
                        disabled={
                          ['RUNNING', 'STOPPED'].indexOf(instance.state) < 0
                        }
                        onClick={() => onAction('remove')}
                        secondary
                        bold
                        right
                        icon
                        error
                      >
                        <Margin right={2}>
                          <DeleteIcon
                            fill={
                              ['RUNNING', 'STOPPED'].indexOf(instance.state) >=
                              0
                                ? theme.red
                                : undefined
                            }
                            disabled={
                              ['RUNNING', 'STOPPED'].indexOf(instance.state) < 0
                            }
                          />
                        </Margin>
                        <span>Remove</span>
                      </Button>
                    </Medium>
                  </Col>
                </Row>
              </Margin>
              <Margin bottom={5} top={3}>
                <Divider height={1} />
              </Margin>
              <Margin bottom={3}>
                <CopiableField
                  text={(instance.id || '').split('-')[0]}
                  label="Short ID"
                />
              </Margin>
              <Margin bottom={3}>
                <CopiableField text={instance.id} label="ID" />
              </Margin>
              <Margin bottom={3}>
                <CopiableField text={instance.compute_node} label="CN UUID" />
              </Margin>
              {instance.image &&
                instance.image.id && (
                  <Margin bottom={3}>
                    <CopiableField
                      text={instance.image.id}
                      label="Image UUID"
                    />
                  </Margin>
                )}
              <Margin bottom={3}>
                <CopiableField
                  text={`ssh root@${instance.primary_ip}`}
                  label="Login"
                />
              </Margin>
              {get(instance, 'ips.public', []).map((ip, i, ips) => (
                <Margin bottom={3}>
                  <CopiableField
                    key={`public-${i}`}
                    label={`Public IP address ${ips.length > 1 ? i + 1 : ''}`}
                    text={ip}
                  />
                </Margin>
              ))}
              {get(instance, 'ips.private', []).map((ip, i, ips) => (
                <Margin bottom={3}>
                  <CopiableField
                    key={`private-${i}`}
                    noMargin={i === ips.length - 1}
                    label={`Private IP address ${ips.length > 1 ? i + 1 : ''}`}
                    text={ip}
                  />
                </Margin>
              ))}
            </Padding>
          </CardOutlet>
        </Card>
      </Col>
    </Row>
  )
);

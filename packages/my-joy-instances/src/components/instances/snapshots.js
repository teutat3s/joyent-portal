import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import titleCase from 'title-case';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import remcalc from 'remcalc';
import { Margin } from 'styled-components-spacing';

import {
  FormGroup,
  StatusLoader,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  Checkbox,
  KeyValue,
  Popover,
  PopoverContainer,
  PopoverTarget,
  PopoverItem,
  ActionsIcon,
  DotIcon
} from 'joyent-ui-toolkit';

import Empty from '@components/empty';

const stateColor = {
  QUEUED: 'primary',
  CREATED: 'green'
};

const loadingState = {
  start: 'Starting...',
  remove: 'Removing...'
};

export const Item = ({ name, state, created, onStart, onRemove, mutating }) => (
  <TableTr>
    {!mutating ? (
      <Fragment>
        <TableTd padding="0" paddingLeft={remcalc(12)} middle left>
          <FormGroup paddingTop={remcalc(4)} name={name} field={Field}>
            <Checkbox noMargin />
          </FormGroup>
        </TableTd>
        <TableTd middle left>
          {name}
        </TableTd>
        <TableTd middle left>
          <DotIcon size={remcalc(12)} color={stateColor[state]} />{' '}
          {titleCase(state)}
        </TableTd>
        <TableTd xs="0" sm="160" middle left>
          {distanceInWordsToNow(created)}
        </TableTd>
        <PopoverContainer clickable>
          <TableTd padding="0" hasBorder="left">
            <PopoverTarget box>
              <ActionsIcon />
            </PopoverTarget>
            <Popover placement="top">
              <Margin vertical={2} horizontal={3}>
                <PopoverItem onClick={onStart}>Start</PopoverItem>
              </Margin>
              <Margin vertical={2} horizontal={3}>
                <PopoverItem onClick={onRemove}>Remove</PopoverItem>
              </Margin>
            </Popover>
          </TableTd>
        </PopoverContainer>
      </Fragment>
    ) : (
      <TableTd colSpan="5">
        <StatusLoader msg={loadingState[mutating]} />
      </TableTd>
    )}
  </TableTr>
);

export const AddForm = props => (
  <KeyValue
    {...props}
    method="create"
    input="input"
    type="snapshot"
    typeLabel="name"
    expanded
    onlyName
    noRemove
  />
);

export default ({
  snapshots = [],
  selected = [],
  error,
  handleChange = () => null,
  onAction = () => null,
  submitting = false,
  sortBy = 'name',
  sortOrder = 'desc',
  onSortBy = () => null,
  allSelected = false,
  toggleSelectAll = () => null,
  onStart,
  onRemove,
  ...rest
}) => (
  <Fragment>
    <Table>
      <TableThead>
        <TableTr>
          <TableTh xs="32" padding="0" paddingLeft={remcalc(12)} middle left>
            <FormGroup paddingTop={remcalc(4)}>
              <Checkbox
                checked={allSelected}
                disabled={submitting}
                onChange={toggleSelectAll}
                noMargin
              />
            </FormGroup>
          </TableTh>
          <TableTh
            onClick={() => onSortBy('name', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'name'}
            left
            middle
            actionable
          >
            <span>Name </span>
          </TableTh>
          <TableTh
            xs="150"
            onClick={() => onSortBy('state', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'state'}
            left
            middle
            actionable
          >
            <span>Status </span>
          </TableTh>
          <TableTh
            xs="0"
            sm="160"
            onClick={() => onSortBy('created', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'created'}
            left
            middle
            actionable
          >
            <span>Created </span>
          </TableTh>
          <TableTh xs="60" padding="0" />
        </TableTr>
      </TableThead>
      <TableTbody>
        {snapshots.length
          ? snapshots.map(snapshot => (
              <Item
                onStart={() => onStart(snapshot)}
                onRemove={() => onRemove(snapshot)}
                key={snapshot.id}
                {...snapshot}
              />
            ))
          : null}
      </TableTbody>
    </Table>
    {!snapshots.length ? <Empty borderTop>You have no Snapshots</Empty> : null}
  </Fragment>
);

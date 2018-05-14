import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import { Margin, Padding } from 'styled-components-spacing';
import Flex from 'styled-flex-component';
import bytes from 'bytes';
import is, { isNot } from 'styled-is';
import remcalc from 'remcalc';

import {
  H3,
  H4,
  Sup,
  FormGroup,
  Card,
  Button,
  TableTh,
  TableTr,
  TableThead,
  Divider,
  TableTbody,
  Table,
  TableTd,
  Radio,
  Checkbox,
  FormLabel,
  GeneralIcon,
  StorageIcon,
  CpuIcon,
  MemoryIcon
} from 'joyent-ui-toolkit';

import { EmptyState } from 'joyent-icons';

const GroupIcons = {
  MEMORY: <MemoryIcon fill="#32ABCF" />,
  STORAGE: <StorageIcon fill="#A88A83" />,
  GENERAL: <GeneralIcon fill="#E08A0E" />,
  COMPUTE: <CpuIcon fill="#8043DC" />
};

const fourDecimals = n => parseFloat(Math.round(n * 10000) / 10000).toFixed(4);

const TableTrActionable = styled(TableTr)`
  cursor: pointer;
`;

const NoPackagesTitle = styled(H3)`
  color: ${props => props.theme.greyDark};
  text-align: center;
`;

const FullWidthCard = styled(Card)`
  width: calc(100% - ${remcalc(2)});
  ${is('transparent')`
    background: transparent;
  `};
  ${isNot('borderTop')`
    border-top: none;
  `};
`;

export const Filters = ({ onResetFilters }) => (
  <Margin bottom={3}>
    <Margin bottom={3}>
      <H4>Filters</H4>
    </Margin>
    <Flex wrap alignCenter>
      <FormGroup type="checkbox" name="compute-optimized" field={Field}>
        <Checkbox>
          <FormLabel noMargin actionable>
            <Flex alignCenter>
              <Margin left={1}>{GroupIcons.COMPUTE}</Margin>
              <Margin left={1} right={3}>
                Compute Optimized
              </Margin>
            </Flex>
          </FormLabel>
        </Checkbox>
      </FormGroup>
      <FormGroup type="checkbox" name="memory-optimized" field={Field}>
        <Checkbox>
          <FormLabel noMargin actionable>
            <Flex alignCenter>
              <Margin left={1}>{GroupIcons.MEMORY}</Margin>
              <Margin left={1} right={3}>
                Memory Optimized
              </Margin>
            </Flex>
          </FormLabel>
        </Checkbox>
      </FormGroup>
      <FormGroup type="checkbox" name="general-purpose" field={Field}>
        <Checkbox>
          <FormLabel noMargin actionable>
            <Flex alignCenter>
              <Margin left={1}>{GroupIcons.GENERAL}</Margin>
              <Margin left={1} right={3}>
                General Purpose
              </Margin>
            </Flex>
          </FormLabel>
        </Checkbox>
      </FormGroup>
      <FormGroup type="checkbox" name="storage-optimized" field={Field}>
        <Checkbox>
          <FormLabel noMargin actionable>
            <Flex alignCenter>
              <Margin left={1}>{GroupIcons.GENERAL}</Margin>
              <Margin left={1} right={3}>
                Storage Optimized
              </Margin>
            </Flex>
          </FormLabel>
        </Checkbox>
      </FormGroup>
      <FormGroup type="checkbox" name="ssd" field={Field}>
        <Checkbox>
          <FormLabel noMargin actionable>
            <Margin left={1}>SSD</Margin>
          </FormLabel>
        </Checkbox>
      </FormGroup>
    </Flex>
    <Margin top={3} bottom={5}>
      <Button type="button" onClick={onResetFilters} secondary>
        Reset Filters
      </Button>
    </Margin>
  </Margin>
);

export const Package = ({
  selected = false,
  id,
  name,
  group,
  memory,
  price,
  vcpus,
  disk,
  ssd,
  hasVms,
  sortBy,
  onRowClick
}) => (
  <TableTrActionable onClick={() => onRowClick(id)}>
    <TableTd right selected={selected}>
      <FormGroup name="package" value={id} type="radio" field={Field} fluid>
        <Radio onBlur={null} noMargin>
          <Flex alignCenter>
            <Margin left={5} right={1}>
              {GroupIcons[group]}
            </Margin>
            <Margin left={1} right={2}>
              <FormLabel
                style={{ fontWeight: sortBy === 'name' ? 'bold' : 'normal' }}
                noMargin
                actionable
              >
                {name}
              </FormLabel>
            </Margin>
          </Flex>
        </Radio>
      </FormGroup>
    </TableTd>
    <TableTd right selected={selected} bold={sortBy === 'memory'}>
      {bytes(memory, { decimalPlaces: 0, unitSeparator: ' ' })}
    </TableTd>
    <TableTd right selected={selected} bold={sortBy === 'disk'}>
      <Margin inline right={1}>
        {bytes(disk, { decimalPlaces: 0, unitSeparator: ' ' })}
      </Margin>
      {ssd && <Sup badge>SSD</Sup>}
    </TableTd>
    {hasVms && (
      <TableTd right bold={sortBy === 'vcpus'} selected={selected}>
        {vcpus}
      </TableTd>
    )}
    <TableTd right bold={sortBy === 'price'} selected={selected}>
      {fourDecimals(price)}
    </TableTd>
  </TableTrActionable>
);

export const Packages = ({
  pristine,
  sortBy = 'name',
  sortOrder = 'desc',
  onSortBy = () => null,
  hasVms,
  children,
  packages
}) => (
  <form>
    <Table>
      <TableThead>
        <TableTr>
          <TableTh
            onClick={() => onSortBy('name', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'name'}
            left
            middle
            xs="200"
            actionable
          >
            <span>Name </span>
          </TableTh>
          <TableTh
            xs="100"
            onClick={() => onSortBy('memory', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'memory'}
            right
            middle
            actionable
          >
            <span>RAM </span>
          </TableTh>
          <TableTh
            xs="100"
            onClick={() => onSortBy('disk', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'disk'}
            right
            middle
            actionable
          >
            <span>Disk </span>
          </TableTh>
          {hasVms && (
            <TableTh
              xs="100"
              onClick={() => onSortBy('vcpus', sortOrder)}
              sortOrder={sortOrder}
              showSort={sortBy === 'vcpus'}
              right
              middle
              actionable
            >
              <span>vCPU</span>
            </TableTh>
          )}
          <TableTh
            xs="100"
            onClick={() => onSortBy('price', sortOrder)}
            sortOrder={sortOrder}
            showSort={sortBy === 'price'}
            right
            middle
            actionable
          >
            <span>$/hour</span>
          </TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{children}</TableTbody>
    </Table>
    {packages ? null : (
      <Empty>
        Sorry, but we weren’t able to find any packages with that filter
      </Empty>
    )}
  </form>
);

export const Overview = ({
  name,
  price,
  memory,
  vcpus,
  hasVms,
  ssd,
  disk,
  onCancel
}) => (
  <Fragment>
    <Margin bottom={2}>
      <H3 noMargin>{name}</H3>
    </Margin>
    <Flex alignCenter>
      <span>{price} $</span>
      <Divider vertical />
      <span>{bytes(memory, { decimalPlaces: 0, unitSeparator: ' ' })}</span>
      {hasVms && (
        <Fragment>
          <Divider vertical />
          <span>{vcpus} vCPUS</span>
        </Fragment>
      )}
      <Divider vertical />
      <span>{bytes(disk, { decimalPlaces: 0, unitSeparator: ' ' })} disk</span>
      <Divider vertical />
      {ssd && <span>SSD</span>}
    </Flex>
  </Fragment>
);

export const Empty = ({ children, ...rest }) => (
  <FullWidthCard {...rest}>
    <Padding all={6}>
      <Flex alignCenter justifyCenter column>
        <Margin bottom={2}>
          <EmptyState />
        </Margin>
        <NoPackagesTitle>{children}</NoPackagesTitle>
      </Flex>
    </Padding>
  </FullWidthCard>
);

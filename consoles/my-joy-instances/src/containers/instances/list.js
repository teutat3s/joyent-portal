import React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { stopSubmit, startSubmit, reset, change } from 'redux-form';
import { set } from 'react-redux-values';
import ReduxForm from 'declarative-redux-form';
import { Margin } from 'styled-components-spacing';
import forceArray from 'force-array';
import queryString from 'query-string';
import intercept from 'apr-intercept';
import get from 'lodash.get';
import find from 'lodash.find';
import isInteger from 'lodash.isinteger';
import isNaN from 'lodash.isnan';
import reverse from 'lodash.reverse';
import sort from 'lodash.sortby';
import remcalc from 'remcalc';
import Fuse from 'fuse.js';

import {
  ViewContainer,
  Message,
  MessageDescription,
  MessageTitle,
  StatusLoader,
  Divider,
  H3
} from 'joyent-ui-toolkit';

import GLOBAL from '@state/global';
import ListInstances from '@graphql/list-instances.gql';
import StopInstance from '@graphql/stop-instance.gql';
import StartInstance from '@graphql/start-instance.gql';
import RebootInstance from '@graphql/reboot-instance.gql';
import RemoveInstance from '@graphql/remove-instance.gql';
import ToolbarForm from '@components/instances/toolbar';
import Empty from 'joyent-ui-resource-step';
import parseError from '@state/parse-error';
import Confirm from '@state/confirm';

import {
  default as InstanceList,
  FetchingItem as InstanceListFetchingItem,
  Item as InstanceListItem
} from '@components/instances/list';

import InstanceListActions from '@components/instances/footer';

const TABLE_FORM_NAME = 'instance-list-table';
const MENU_FORM_NAME = 'instance-list-menu';

export const List = ({
  limit,
  offset,
  total,
  fetching,
  instances = [],
  selected = [],
  allowedActions,
  statuses,
  sortBy = 'name',
  sortOrder = 'desc',
  loading = false,
  error = null,
  mutationError = null,
  submitting,
  handleAction,
  toggleSelectAll,
  handleCreateImage,
  handleSortBy,
  history,
  filter = ''
}) => {
  const _instances = forceArray(instances);

  const _loading =
    loading && !_instances.length
      ? [
          <Divider key="divider" height={remcalc(30)} transparent />,
          <StatusLoader key="spinner" />
        ]
      : null;

  const _error =
    error && !_instances.length && !_loading && !filter.length ? (
      <Margin bottom="5">
        <Message error>
          <MessageTitle>Ooops!</MessageTitle>
          <MessageDescription>
            An error occurred while loading your instances
          </MessageDescription>
        </Message>
      </Margin>
    ) : null;

  const _mutationError = mutationError && (
    <Margin bottom="5">
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>{mutationError}</MessageDescription>
      </Message>
    </Margin>
  );

  const handleStart = selected => handleAction({ name: 'start', selected });
  const handleStop = selected => handleAction({ name: 'stop', selected });
  const handleReboot = selected => handleAction({ name: 'reboot', selected });
  const handleRemove = selected => handleAction({ name: 'remove', selected });

  const _table = _loading ? null : (
    <ReduxForm form={TABLE_FORM_NAME}>
      {props => (
        <InstanceList
          {...props}
          allSelected={instances.length && selected.length === instances.length}
          sortBy={sortBy}
          sortOrder={sortOrder}
          toggleSelectAll={toggleSelectAll}
          onSortBy={handleSortBy}
          noInstances={!_instances.length}
          limit={limit}
          offset={offset}
          total={total}
        >
          {fetching ? <InstanceListFetchingItem /> : null}
          {(fetching ? [] : _instances).map(instance => (
            <InstanceListItem
              key={instance.id}
              {...instance}
              onCreateImage={() => handleCreateImage(instance)}
              onStart={() => handleStart([instance])}
              onStop={() => handleStop([instance])}
              onReboot={() => handleReboot([instance])}
              onRemove={() => handleRemove([instance])}
            />
          ))}
        </InstanceList>
      )}
    </ReduxForm>
  );

  const _empty =
    !_loading && !_instances.length ? (
      <Empty>
        {filter
          ? 'You have no Instances that match your query'
          : `You haven't created any instances yet, but they're really easy to set up.
        Click above to get going.`}
      </Empty>
    ) : null;

  const _footer =
    !_loading && selected.length ? (
      <InstanceListActions
        allowedActions={allowedActions}
        statuses={statuses}
        submitting={submitting}
        onStart={() => handleStart(selected)}
        onStop={() => handleStop(selected)}
        onReboot={() => handleReboot(selected)}
        onRemove={() => handleRemove(selected)}
      />
    ) : null;

  return (
    <ViewContainer main>
      <Margin top="5">
        <H3>Instances</H3>
      </Margin>
      <Margin top="3" bottom="5">
        <ReduxForm form={MENU_FORM_NAME}>
          {props => (
            <ToolbarForm
              {...props}
              searchLabel="Filter instances"
              searchable={!_loading}
              actionLabel="Create Instance"
              actionTo="/instances/~create/name"
            />
          )}
        </ReduxForm>
      </Margin>
      {_mutationError ? null : _error}
      {_mutationError}
      {_loading}
      {_table}
      {_empty}
      {_footer}
    </ViewContainer>
  );
};

export default compose(
  graphql(StopInstance, { name: 'stop' }),
  graphql(StartInstance, { name: 'start' }),
  graphql(RebootInstance, { name: 'reboot' }),
  graphql(RemoveInstance, { name: 'remove' }),
  graphql(ListInstances, {
    options: ({ location }) => ({
      ssr: false,
      pollInterval: 1000,
      variables: {
        limit: 25,
        offset: 0,
        ...queryString.parse(location.search)
      }
    }),
    props: ({ data: { loading, error, refetch, variables, ...rest } }) => {
      const result = get(rest, 'machines', {}) || {};
      const machines = get(result, 'results', []);
      const offset = Number(variables.offset);
      const limit = Number(variables.limit);

      const fetching =
        !error &&
        isInteger(result.limit) &&
        isInteger(result.offset) &&
        !(limit === result.limit && offset === result.offset);

      const instances = forceArray(machines).map(({ state, ...machine }) => ({
        ...machine,
        state,
        allowedActions: {
          start: state !== 'RUNNING',
          stop: state === 'RUNNING',
          reboot: state === 'RUNNING',
          remove: state !== 'PROVISIONING'
        }
      }));

      const index = new Fuse(instances, {
        keys: ['id', 'name', 'status', 'created']
      });

      return {
        limit: isNaN(limit) ? result.limit : limit,
        offset: isNaN(offset) ? result.offset : offset,
        total: result.total,
        fetching,
        instances,
        loading,
        error,
        index,
        refetch
      };
    }
  }),
  connect(
    ({ form, values }, { index, error, instances = [] }) => {
      // get search value
      const filter = get(form, `${MENU_FORM_NAME}.values.filter`, false);
      // check checked items ids
      const checked = get(form, `${TABLE_FORM_NAME}.values`, {});
      // check whether the main form is submitting
      const submitting = get(form, `${TABLE_FORM_NAME}.submitting`, false);
      // check whether the main form has an error
      const mutationError = get(form, `${TABLE_FORM_NAME}.error`, null);
      // get sort values
      const sortBy = get(values, 'instance-list-sort-by', 'name');
      const sortOrder = get(values, 'instance-list-sort-order', 'asc');

      // if user is searching something, get items that match that query
      const filtered =
        filter && index.list.length
          ? index.list.filter(i => i.name.includes(filter))
          : instances;

      // from filtered instances, sort asc
      // set's mutating flag
      const ascSorted = sort(filtered, [sortBy]).map(({ id, ...item }) => ({
        ...item,
        id,
        mutating: get(values, `${id}-mutating`, false)
      }));

      // if "select-all" is checked, all the instances are selected
      // otherwise, map through the checked ids and get the instance value
      const selected = Object.keys(checked)
        .filter(id => Boolean(checked[id]))
        .map(id => find(ascSorted, ['id', id]))
        .filter(Boolean);

      const allowedActions = {
        start: selected.every(({ state }) => state === 'STOPPED'),
        stop: selected.every(({ state }) => state === 'RUNNING'),
        reboot: selected.every(({ state }) => state === 'RUNNING'),
        remove: selected.every(({ state }) => state !== 'PROVISIONING')
      };

      // get mutating statuses
      const statuses = {
        starting: get(values, 'instance-list-starting', false),
        stopping: get(values, 'instance-list-stoping', false),
        rebooting: get(values, 'instance-list-rebooting', false),
        removing: get(values, 'instance-list-removeing', false)
      };

      return {
        // is sortOrder !== asc, reverse order
        instances: sortOrder === 'asc' ? ascSorted : reverse(ascSorted),
        allowedActions,
        selected,
        statuses,
        submitting,
        mutationError,
        index,
        sortOrder,
        sortBy,
        filter
      };
    },
    (dispatch, { refetch, ...ownProps }) => ({
      handleCreateImage: ({ id }) => {
        return window
          .open(`${GLOBAL.origin}/images/~create/${id}`, '_blank')
          .focus();
      },
      handleSortBy: ({ sortBy: currentSortBy, sortOrder }) => newSortBy => {
        // sort prop is the same, toggle
        if (currentSortBy === newSortBy) {
          return dispatch(
            set({
              name: `instance-list-sort-order`,
              value: sortOrder === 'desc' ? 'asc' : 'desc'
            })
          );
        }

        dispatch([
          set({
            name: `instance-list-sort-order`,
            value: 'desc'
          }),
          set({
            name: `instance-list-sort-by`,
            value: newSortBy
          })
        ]);
      },
      toggleSelectAll: ({ selected = [], instances = [] }) => () => {
        const same = selected.length === instances.length;
        const hasSelected = selected.length > 0;

        // none are selected, toggle to all
        if (!hasSelected) {
          return dispatch(
            instances.map(({ id }) => change(TABLE_FORM_NAME, id, true))
          );
        }

        // all are selected, toggle to none
        if (hasSelected && same) {
          return dispatch(
            instances.map(({ id }) => change(TABLE_FORM_NAME, id, false))
          );
        }

        // some are selected, toggle to all
        if (hasSelected && !same) {
          return dispatch(
            instances.map(({ id }) => change(TABLE_FORM_NAME, id, true))
          );
        }
      },
      handleAction: async ({ selected, name }) => {
        // eslint-disable-next-line no-alert
        if (
          !await Confirm(
            `Do you want to ${name} ${
              selected.length === 1
                ? `"${selected[0].name}"`
                : `${selected.length} instances`
            }`
          )
        ) {
          return;
        }

        const action = ownProps[name];
        const gerund = `${name}ing`;

        // flips submitting flag to true so that we can disable everything
        const flipSubmitTrue = startSubmit(TABLE_FORM_NAME);

        // sets (starting/rebooting/etc) to true so that we can, for instance,
        // have a spinner on the correct button
        const setIngTrue = set({
          name: `instance-list-${gerund}`,
          value: true
        });

        // sets the individual item mutation flags so that we can show a
        // spinner in the row
        const setMutatingTrue = selected.map(({ id }) =>
          set({ name: `${id}-mutating`, value: true })
        );

        // wait for everything to finish and catch the error
        const [err] = await intercept(
          Promise.resolve(
            dispatch([flipSubmitTrue, setIngTrue, ...setMutatingTrue])
          ).then(() => {
            // starts all the mutations for all the selected items
            return Promise.all(
              selected.map(({ id }) => action({ variables: { id } }))
            );
          })
        );

        // reverts submitting flag to false and propagates the error if it exists
        const flipSubmitFalse = stopSubmit(TABLE_FORM_NAME, {
          _error: err && parseError(err)
        });

        // if no error, clears selected
        const clearSelected = !err && reset(TABLE_FORM_NAME);

        // reverts (starting/rebooting/etc) to false
        const setIngFalse = set({
          name: `instance-list-${gerund}`,
          value: false
        });

        // reverts the individual item mutation flags
        const setMutatingFalse =
          name !== 'remove' &&
          selected.map(({ id }) =>
            set({ name: `${id}-mutating`, value: false })
          );

        const actions = [
          flipSubmitFalse,
          clearSelected,
          setIngFalse,
          ...setMutatingFalse
        ].filter(Boolean);

        // refetch list - even though we poll anyway - after clearing everything
        return Promise.resolve(dispatch(actions)).then(() => refetch());
      }
    }),
    (stateProps, dispatchProps, ownProps) => {
      const { selected, instances, sortBy, sortOrder } = stateProps;
      const { toggleSelectAll, handleSortBy } = dispatchProps;

      return {
        ...ownProps,
        ...stateProps,
        selected,
        instances,
        ...dispatchProps,
        toggleSelectAll: toggleSelectAll({ selected, instances }),
        handleSortBy: handleSortBy({ sortBy, sortOrder })
      };
    }
  )
)(List);

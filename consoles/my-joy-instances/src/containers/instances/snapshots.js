import React from 'react';
import forceArray from 'force-array';
import { connect } from 'react-redux';
import { stopSubmit, startSubmit, change, reset } from 'redux-form';
import { compose, graphql } from 'react-apollo';
import { Margin } from 'styled-components-spacing';
import find from 'lodash.find';
import reverse from 'lodash.reverse';
import get from 'lodash.get';
import sort from 'lodash.sortby';
import { set } from 'react-redux-values';
import ReduxForm from 'declarative-redux-form';
import intercept from 'apr-intercept';
import Fuse from 'fuse.js';

import {
  ViewContainer,
  Message,
  MessageTitle,
  MessageDescription,
  StatusLoader
} from 'joyent-ui-toolkit';

import {
  default as SnapshotsList,
  AddForm as SnapshotAddForm
} from '@components/instances/snapshots';

import GetSnapshots from '@graphql/list-snapshots.gql';
import StartSnapshot from '@graphql/start-from-snapshot.gql';
import RemoveSnapshot from '@graphql/remove-snapshot.gql';
import CreateSnapshotMutation from '@graphql/create-snapshot.gql';
import ToolbarForm from '@components/instances/toolbar';
import SnapshotsListActions from '@components/instances/footer';
import { addSnapshot as validateSnapshot } from '@state/validators';
import parseError from '@state/parse-error';
import Confirm from '@state/confirm';

const MENU_FORM_NAME = 'snapshot-list-menu';
const TABLE_FORM_NAME = 'snapshot-list-table';
const CREATE_FORM_NAME = 'create-snapshot-form';

const Snapshots = ({
  snapshots = [],
  instance = {},
  selected = [],
  loading,
  submitting,
  error,
  mutationError,
  allowedActions,
  statuses,
  handleAction,
  handleCreateSnapshot,
  sortOrder,
  handleSortBy,
  sortBy,
  toggleSelectAll,
  toggleCreateSnapshotOpen,
  createSnapshotOpen,
  shouldAsyncValidate,
  handleAsyncValidate
}) => {
  const _values = forceArray(snapshots);
  const _loading = !_values.length && loading ? <StatusLoader /> : null;

  const handleStart = selected => handleAction({ name: 'start', selected });
  const handleRemove = selected => handleAction({ name: 'remove', selected });

  const _error = error &&
    !_loading &&
    !_values.length && (
      <Margin bottom="5">
        <Message error>
          <MessageTitle>Ooops!</MessageTitle>
          <MessageDescription>
            An error occurred while loading your instance snapshots
          </MessageDescription>
        </Message>
      </Margin>
    );

  const _createSnapshot =
    !loading && createSnapshotOpen ? (
      <Margin bottom="5">
        <ReduxForm
          form={CREATE_FORM_NAME}
          shouldAsyncValidate={shouldAsyncValidate}
          asyncValidate={handleAsyncValidate}
          onSubmit={handleCreateSnapshot}
        >
          {props => (
            <SnapshotAddForm
              {...props}
              onCancel={() => toggleCreateSnapshotOpen(false)}
            />
          )}
        </ReduxForm>
      </Margin>
    ) : null;

  const _footer =
    !loading && selected.length > 0 ? (
      <SnapshotsListActions
        submitting={submitting}
        allowedActions={allowedActions}
        statuses={statuses}
        onStart={() => handleStart(selected)}
        onRemove={() => handleRemove(selected)}
      />
    ) : null;

  const _mutationError = mutationError ? (
    <Margin bottom="5">
      <Message error>
        <MessageTitle>Ooops!</MessageTitle>
        <MessageDescription>{mutationError}</MessageDescription>
      </Message>
    </Margin>
  ) : null;

  const _items = _loading ? null : (
    <ReduxForm form={TABLE_FORM_NAME}>
      {props => (
        <SnapshotsList
          snapshots={_values}
          onStart={snapshot => handleStart([snapshot])}
          onRemove={snapshot => handleRemove([snapshot])}
          selected={selected}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortBy={handleSortBy}
          toggleSelectAll={toggleSelectAll}
          allSelected={_values.length && selected.length === _values.length}
        />
      )}
    </ReduxForm>
  );

  return (
    <ViewContainer main>
      <Margin bottom="5">
        <ReduxForm form={MENU_FORM_NAME}>
          {props => (
            <ToolbarForm
              {...props}
              searchLabel="Filter snapshots"
              searchPlaceholder="Search for name, created...."
              searchable={!_loading}
              actionLabel="Create Snapshot"
              actionable={!createSnapshotOpen}
              onActionClick={() => toggleCreateSnapshotOpen(true)}
            />
          )}
        </ReduxForm>
      </Margin>
      {_loading}
      {_error}
      {_mutationError}
      {_createSnapshot}
      {_items}
      {_footer}
    </ViewContainer>
  );
};

export default compose(
  graphql(StartSnapshot, { name: 'start' }),
  graphql(RemoveSnapshot, { name: 'remove' }),
  graphql(CreateSnapshotMutation, { name: 'createSnapshot' }),
  graphql(GetSnapshots, {
    options: ({ match }) => ({
      ssr: false,
      pollInterval: 1000,
      variables: {
        id: get(match, 'params.instance')
      }
    }),
    props: ({ data: { loading, error, machine, refetch, ...rest } }) => {
      const snapshots = get(machine, 'snapshots', []);

      const index = new Fuse(snapshots, {
        keys: ['name', 'status', 'created']
      });

      return {
        index,
        snapshots,
        instance: machine,
        loading,
        error,
        refetch
      };
    }
  }),
  connect(
    ({ form, values }, { index, snapshots = [], ...rest }) => {
      const tableValues = get(form, `${TABLE_FORM_NAME}.values`) || {};
      const filter = get(form, `${MENU_FORM_NAME}.values.filter`, false);

      // check whether the table form has an error
      const tableMutationError = get(form, `${TABLE_FORM_NAME}.error`, null);
      // check whether the create form has an error
      const createMutationError = get(form, `${CREATE_FORM_NAME}.error`, null);
      // check whether the main form is submitting
      const submitting = get(form, `${TABLE_FORM_NAME}.submitting`, false);

      const selected = Object.keys(tableValues)
        .filter(key => Boolean(tableValues[key]))
        .map(name => find(snapshots, ['name', name]))
        .filter(Boolean);

      const sortBy = get(values, 'snapshots-list-sort-by', 'name');
      const sortOrder = get(values, 'snapshots-list-sort-order', 'asc');
      const createSnapshotOpen = get(values, 'snapshots-create-open', false);

      // if user is searching something, get items that match that query
      const filtered = filter ? index.search(filter) : snapshots;

      // from filtered instances, sort asc
      // set's mutating flag
      const ascSorted = sort(filtered, [sortBy]).map(({ id, ...item }) => ({
        ...item,
        id,
        mutating: get(values, `${id}-mutating`, false)
      }));

      const allowedActions = {
        start: selected.length === 1,
        remove: true
      };

      // get mutating statuses
      const statuses = {
        starting: get(values, 'snapshot-list-starting', false),
        removing: get(values, 'snapshot-list-removeing', false)
      };

      return {
        ...rest,
        snapshots: sortOrder === 'asc' ? ascSorted : reverse(ascSorted),
        selected,
        sortBy,
        sortOrder,
        submitting,
        mutationError: tableMutationError || createMutationError,
        allowedActions,
        statuses,
        createSnapshotOpen
      };
    },
    (dispatch, ownProps) => {
      const { instance, snapshots, createSnapshot, refetch } = ownProps;

      return {
        shouldAsyncValidate: ({ trigger }) => {
          return trigger === 'submit';
        },
        handleAsyncValidate: async ({ name }) => {
          const [err] = await intercept(validateSnapshot({ name }));

          if (err) {
            throw err;
          }

          const snapshot = find(snapshots, ['name', name]);
          if (snapshot) {
            // eslint-disable-next-line no-throw-literal
            throw {
              name: `${name} already exists`
            };
          }
        },
        handleSortBy: (newSortBy, sortOrder) => {
          return dispatch([
            set({
              name: `snapshots-list-sort-order`,
              value: sortOrder === 'desc' ? 'asc' : 'desc'
            }),
            set({
              name: `snapshots-list-sort-by`,
              value: newSortBy
            })
          ]);
        },
        toggleCreateSnapshotOpen: value => {
          return dispatch(
            set({
              name: `snapshots-create-open`,
              value
            })
          );
        },
        toggleSelectAll: ({ selected = [], snapshots = [] }) => () => {
          const same = selected.length === snapshots.length;
          const hasSelected = selected.length > 0;

          // none are selected, toggle to all
          if (!hasSelected) {
            return dispatch(
              snapshots.map(({ name }) => change(TABLE_FORM_NAME, name, true))
            );
          }

          // all are selected, toggle to none
          if (hasSelected && same) {
            return dispatch(
              snapshots.map(({ name }) => change(TABLE_FORM_NAME, name, false))
            );
          }

          // some are selected, toggle to all
          if (hasSelected && !same) {
            return dispatch(
              snapshots.map(({ name }) => change(TABLE_FORM_NAME, name, true))
            );
          }
        },
        handleCreateSnapshot: async ({ name }) => {
          const [err] = await intercept(
            createSnapshot({
              variables: {
                name: name
                  .trim()
                  .split(' ')
                  .join('_'),
                id: instance.id
              }
            })
          );

          if (err) {
            return dispatch(
              stopSubmit(TABLE_FORM_NAME, {
                _error: parseError(err)
              })
            );
          }

          await refetch();

          dispatch(
            set({
              name: `snapshots-create-open`,
              value: false
            })
          );
        },
        handleAction: async ({ name, selected = [] }) => {
          // eslint-disable-next-line no-alert
          if (
            !(await Confirm(
              `Do you want to ${name} ${
                selected.length === 1
                  ? `"${selected[0].name}"`
                  : `${selected.length} snapshots`
              }`
            ))
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
            name: `snapshot-list-${gerund}`,
            value: true
          });

          // sets the individual item mutation flags so that we can show a
          // spinner in the row
          const setMutatingTrue = selected.map(({ id }) =>
            set({ name: `${id}-mutating`, value: name })
          );

          // wait for everything to finish and catch the error
          const [err] = await intercept(
            Promise.resolve(
              dispatch([flipSubmitTrue, setIngTrue, ...setMutatingTrue])
            ).then(() => {
              // starts all the mutations for all the selected items
              return Promise.all(
                selected.map(({ name }) =>
                  action({ variables: { id: instance.id, snapshot: name } })
                )
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
            name: `snapshot-list-${gerund}`,
            value: false
          });

          // reverts the individual item mutation flags
          // when action === remove, let it stay spinning
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
      };
    },
    (stateProps, dispatchProps, ownProps) => {
      const { selected, snapshots } = stateProps;
      const { toggleSelectAll } = dispatchProps;

      return {
        ...ownProps,
        ...stateProps,
        selected,
        snapshots,
        ...dispatchProps,
        toggleSelectAll: toggleSelectAll({ selected, snapshots })
      };
    }
  )
)(Snapshots);

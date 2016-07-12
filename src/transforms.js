import React from 'react';
import { mergeClassNames } from './table/utils';

const edit = ({
  isEditing = () => {},
  onActivate = () => {},
  onValue = () => {}
} = {}) => editor => (value, extraParameters, props = {}) => (
  isEditing(extraParameters) ?
  {
    children: React.createElement(
      editor,
      {
        ...props,
        value,
        onValue: v => onValue(
          { value: v, ...extraParameters }
        )
      }
    )
  } :
  {
    ...props,
    onClick: () => onActivate(extraParameters)
  }
);

const sort = ({
  getSortingColumns = () => [],
  onSort = () => {}
} = {}) => (_value, { columnIndex }, { className, ...props } = {}) => {
  const columns = getSortingColumns();
  let headerClass = 'sort sort-none';

  // Check against undefined to allow zero
  if (columns[columnIndex] !== undefined) {
    headerClass = `sort sort-${columns[columnIndex].direction}`;
  }

  return {
    ...props,
    className: mergeClassNames(className, headerClass),
    onClick: () => onSort(columnIndex)
  };
};

const toFormatter = (transform, element = 'div') => (
  React.createElement(
    element,
    transform
  )
);

export default {
  edit,
  sort,
  toFormatter
};

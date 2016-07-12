/* eslint-disable react/prop-types */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { transforms } from '../src';

const { edit, sort, toFormatter } = transforms;

describe('edit', function () {
  it('activates editing', function () {
    const testProperty = 'test';
    let receivedProperty;
    const editor = edit({
      onActivate({ property }) {
        receivedProperty = property;
      }
    });
    const result = editor('div')('foo', {
      rowData: {},
      property: testProperty
    });

    result.onClick();

    expect(receivedProperty).to.equal(testProperty);
  });

  it('returns an editor', function () {
    const editor = edit({
      isEditing() {
        return true;
      }
    });
    const value = 'foo';
    const editorElement = 'div';
    const result = editor(editorElement)(value, {
      rowData: {},
      property: 'foo'
    });

    expect(result.children.type).to.equal(editorElement);
    expect(result.children.props.value).to.equal(value);
  });

  it('passes onValue to an editor', function () {
    let receivedValue;
    let receivedProperty;
    const editor = edit({
      isEditing() {
        return true;
      },
      onValue({ value, property }) {
        receivedValue = value;
        receivedProperty = property;
      }
    });
    const editorProperty = 'foo';
    const editorValue = 'foobar';
    const result = editor('div')('foo', {
      rowData: {},
      property: editorProperty
    });

    result.children.props.onValue(editorValue);

    expect(receivedValue).to.equal(editorValue);
    expect(receivedProperty).to.equal(editorProperty);
  });
});

describe('sort', function () {
  it('defaults to sort-none class', function () {
    const sorter = sort();
    const result = sorter('testValue', { columnIndex: 0 });

    expect(result.className).to.equal('sort sort-none');
  });

  it('sets sorting class', function () {
    const testColumnIndex = 0;
    const sortDirection = 'asc';
    const sorter = sort({
      getSortingColumns() {
        return {
          [testColumnIndex]: {
            direction: sortDirection,
            position: 0
          }
        };
      }
    });
    const result = sorter('testValue', {
      columnIndex: testColumnIndex
    });

    expect(result.className).to.equal(`sort sort-${sortDirection}`);
  });

  it('triggers sorting on click', function () {
    const testColumnIndex = 0;
    let sorted;
    const sorter = sort({
      onSort(columnIndex) {
        sorted = columnIndex;
      }
    });
    const result = sorter('testValue', {
      columnIndex: testColumnIndex
    });

    result.onClick();

    expect(sorted).to.equal(testColumnIndex);
  });
});

describe('toFormatter', function () {
  it('converts edit to a formatter', function () {
    const editor = edit()('div');
    const formatter = toFormatter(editor());

    expect(React.isValidElement(formatter)).to.equal(true);
  });

  it('converts sort to a formatter', function () {
    const sorter = sort();
    const formatter = toFormatter(
      sorter(
        'testValue',
        {
          columnIndex: 0
        }
      )
    );

    expect(React.isValidElement(formatter)).to.equal(true);
  });

  it('converted sort accepts props', function () {
    const className = 'demo-class';
    const sorter = sort();
    const formatter = toFormatter(
      sorter(
        'testValue', {
          columnIndex: 0
        },
        {
          className
        }
      )
    );
    const element = TestUtils.renderIntoDocument(
      React.createElement(Wrapper, {}, formatter)
    );
    const elem = TestUtils.findRenderedDOMComponentWithClass(
      element, className
    );

    expect(elem).to.exist;
  });
});

class Wrapper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return React.createElement('div', this.props);
  }
}

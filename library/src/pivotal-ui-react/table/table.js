const classnames = require('classnames');
const {Icon} = require('pui-react-iconography');
const React = require('react');
const sortBy = require('lodash.sortby');
const types = React.PropTypes;
import {mergeProps} from 'pui-react-helpers';
require('pui-css-tables');

export class TableHeader extends React.Component {
  static propTypes = {
    onClick: types.func,
    onSortableTableHeaderClick: types.func,
    sortable: types.bool
  };

  handleActivate = (event) => {
    const {sortable, onClick, onSortableTableHeaderClick} = this.props;
    if (sortable) onSortableTableHeaderClick(event);
    if (onClick) onClick(event);
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleActivate(event);
    }
  };

  render() {
    const {onSortableTableHeaderClick, sortable, ...others} = this.props;
    const props = mergeProps(others, {className: {'sortable': sortable}});

    return <th {...props} onClick={this.handleActivate} onKeyDown={this.handleKeyDown} tabIndex="0" role="button" disabled={ !sortable }/>;
  }
}

export const TableCell = ({rowDatum, index, ...props}) => <td {...props}/>;

TableCell.propTypes = {
  index: types.number,
  rowDatum: types.any
};

export const TableRow = ({index, ...props}) => <tr {...props}/>;

TableRow.propTypes = {
  index: types.number
};

export class Table extends React.Component {
  static propTypes = {
    columns: types.array.isRequired,
    CustomRow: types.func,
    data: types.array.isRequired,
    defaultSort: types.string
  };

  constructor(props, context) {
    super(props, context);
    const {columns, defaultSort} = props;

    const sortCol = columns.find(({sortable, attribute}) => {
        return defaultSort ? attribute === defaultSort : sortable;
      }) || {};

    this.state = {sortColumnAttribute: sortCol.attribute, sortOrder: 0};
  }

  updateSort = (attribute, isSortColumn) => {
    if(isSortColumn) {
      return this.setState({sortOrder: ++this.state.sortOrder % 3});
    }

    this.setState({sortColumnAttribute: attribute, sortOrder: 0});
  };

  sortedRows() {
    const {sortColumnAttribute, sortOrder} = this.state;
    const {columns, data} = this.props;

    const sortedData = sortBy(data, (datum) => {
      const column = columns.find(({attribute}) => sortColumnAttribute === attribute);
      const rankFunction = column.sortBy || (i => i);
      return rankFunction(datum[sortColumnAttribute]);
    });

    if(sortOrder === 1) sortedData.reverse();

    return this.rows(sortedData);
  }

  rows(data) {
    const {columns, CustomRow} = this.props;

    return data.map((datum, rowKey) => {
      const cells = columns.map(({attribute, CustomCell}, key) => {
        const Cell = CustomCell || TableCell;
        return <Cell key={key} index={rowKey} value={datum[attribute]} rowDatum={datum}>{datum[attribute]}</Cell>;
      });

      const Row = CustomRow || TableRow;
      return <Row key={rowKey} index={rowKey}>{cells}</Row>;
    });
  }

  renderHeaders() {
    const {sortColumnAttribute, sortOrder} = this.state;

    return this.props.columns.map(({attribute, sortable, displayName, headerProps}, index) => {
      headerProps = headerProps || {};

      const isSortColumn = (sortColumnAttribute === attribute);
      let className, icon;
      if ( isSortColumn ) {
        className = ['sorted-asc', 'sorted-desc', ''][sortOrder];
        icon = [<Icon src="arrow_drop_up"/>,<Icon src="arrow_drop_down"/>,null][sortOrder];
      }

      className = classnames(className, headerProps.className);

      headerProps = {...headerProps,
        className,
        sortable,
        key: index,
        onSortableTableHeaderClick: () => this.updateSort(attribute, isSortColumn)
      };

      return <TableHeader {...headerProps}>{displayName || attribute}{icon}</TableHeader>;
    });
  }

  render() {
    const {sortColumnAttribute} = this.state;
    let {columns, CustomRow, data, defaultSort, ...props} = this.props;
    props = mergeProps(props, {className: ['table', 'table-sortable', 'table-data']});

    const rows = sortColumnAttribute ? this.sortedRows() : this.rows(data);

    return (
      <table {...props}>
        <thead>
          <tr>{this.renderHeaders()}</tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

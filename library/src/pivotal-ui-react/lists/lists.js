import React from 'react';
import classnames from 'classnames';
import 'pui-css-lists';

const types = React.PropTypes;

class ListItem extends React.Component {
  render() {
    return <li {...this.props}/>;
  }
}

function defList(tagName, spacingType, classNames, childClassNames) {
  return class extends React.Component {
    static propTypes = {
      spacing: types.oneOf(['n', 's', 'm', 'l', 'xl']),
      className: types.string,
      unstyled: types.bool,
      divider: types.bool
    };

    render() {
      let {className, spacing, children, unstyled, divider, ...others} = this.props;
      const classes = classnames(classNames(this.props), className, spacing && `${spacingType}${spacing}`);
      if (childClassNames) {
        children = React.Children.map(children, child => React.cloneElement(child, {className: childClassNames}));
      }
      return (
        tagName === 'ul' ? <ul className={classes} {...others}>{children}</ul> :
          tagName === 'ol' ? <ol className={classes} {...others}>{children}</ol> :
            null
      );
    }
  };
}

const UnorderedList = defList(
  'ul', 'lv',
  ({unstyled}) => classnames({
    'list-unordered': !unstyled,
    'list-unstyled': unstyled,
  })
);

const OrderedList = defList('ol', 'lv', ({unstyled}) => classnames({'list-unstyled': unstyled}));

const InlineList = defList('ul', 'lh', ({divider}) => classnames('list-inline', {'list-inline-divider': divider}));

const GroupList = defList('ul', 'lv', () => classnames('list-group'), 'list-group-item');

const GroupListInverse = defList('ul', 'lv', () => classnames('list-group-inverse'), 'list-group-item');

const StepList = defList('ol', 'lh', () => classnames('list-steps'));

const BreadcrumbList = defList('ul', 'lh', () => classnames('list-breadcrumb'));

module.exports = {
  ListItem,
  UnorderedList,
  OrderedList,
  InlineList,
  GroupList,
  GroupListInverse,
  StepList,
  BreadcrumbList
};

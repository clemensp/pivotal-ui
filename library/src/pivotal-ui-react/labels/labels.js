import React from 'react';
import {mergeProps} from 'pui-react-helpers';
import 'pui-css-labels';

class Label extends React.Component {
  render() {
    let defaultProps = {
      className: ['label', 'label-primary']
    };
    let {children, ...others} = this.props;
    let props = mergeProps(others, defaultProps);
    return <span {...props}>{children}</span>;
  }
}

module.exports = {Label};

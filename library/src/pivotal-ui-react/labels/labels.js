import React from 'react';
import {mergeProps} from 'pui-react-helpers';
import 'pui-css-labels';

export class Label extends React.Component {
  render() {
    const defaultProps = {
      className: ['label', 'label-primary']
    };
    const {children, ...others} = this.props;
    const props = mergeProps(others, defaultProps);
    return <span {...props}>{children}</span>;
  }
}

const shallowCompare = require('react-addons-shallow-compare');

export default ParentClass => class ShallowCompare extends ParentClass {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}
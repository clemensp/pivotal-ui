const shallowCompare = require('react-addons-shallow-compare');

module.exports = ParentClass => {
  return class ShallowCompare extends ParentClass {
    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);
    }
  };
};
import AnimationMixin from 'pui-react-animation';

export default ParentClass => class Animation extends ParentClass {
  componentWillUnmount() {
    if (super.componentWillUnmount) super.componentWillUnmount();
    this::AnimationMixin.componentWillUnmount();
  }

  shouldAnimate = AnimationMixin.shouldAnimate;

  animate = AnimationMixin.animate;
}

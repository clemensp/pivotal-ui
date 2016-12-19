function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
}

module.exports = {
  getScrollTop: () => isFirefox() ? document.documentElement.scrollTop : document.body.scrollTop,

  setScrollTop: value => {
    document.body.scrollTop = value;
    document.documentElement.scrollTop = value;
  }
};

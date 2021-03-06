require('../spec_helper');

describe('Modals', function() {
  var Modal, modal;

  beforeEach(function() {
    Modal = require('../../../src/pivotal-ui-react/modals/modals').Modal;
    modal = ReactDOM.render(
      <Modal id="yolo" animation={false}> Hi </Modal>,
      root
    );
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(root);
  });

  it('is closed by default', function() {
    expect('#yolo').not.toExist();
  });

  describe('#open', function() {
    it('opens the modal', function() {
      modal.open();

      expect('#yolo').toExist();
    });
  });
  describe('#close', function() {
    beforeEach(function() {
      modal.open();
    });

    it('closes the modal', function() {
      modal.close();

      expect('#yolo').not.toExist();
    });
  });
});

describe('BaseModal', function() {
  let BaseModal, subject;

  beforeEach(function() {
    BaseModal = require('../../../src/pivotal-ui-react/modals/modals').BaseModal;
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(root);
  });

  describe('show', function() {
    beforeEach(() => {
      subject = ReactDOM.render(
        <BaseModal show id="mr-modal" title="hey mr modal"/>,
        root
      );
    });
    describe('when show is true', () => {
      it('shows the modal', function() {
        expect('#mr-modal').toExist();
        expect('#mr-modal').toContainText('hey mr modal');
      });

      it('renders the title', () => {
        expect('.modal-title').toHaveText('hey mr modal');
      });

      it('renders the modal in a dialog with a scrim', () => {
        expect('.modal-backdrop').toHaveClass(['fade', 'in']);
        expect('.modal').toHaveClass(['fade', 'in']);
        expect('.modal').toHaveAttr('style', /display: block;/);
      });
    });

    describe('when show is false', () => {
      beforeEach(() => {
        subject::setProps({show: false});
      });
      it('hides the modal', () => {
        expect('#mr-modal').not.toExist();
      });
    });
  });

  describe('animations', () => {
    let delay;
    beforeEach(() => {
      delay = BaseModal.ANIMATION_TIME;

      subject = ReactDOM.render(
        <BaseModal show id="mr-modal" title="hey mr modal" animation={true}/>,
        root
      );
    });

    it('animates the modal in (with easeOutQuad)', () => {
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 0px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0;/);
      MockNow.tick(delay / 2);
      MockRaf.next();
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 37\.5px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0.6/);
      MockNow.tick(delay / 2);
      MockRaf.next();
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 50px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0.8;/);
    });

    it('animates the modal out', () => {
      MockNow.tick(delay);
      MockRaf.next();
      subject::setProps({show: false});
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 50px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0.8;/);
      MockNow.tick(delay / 2);
      MockRaf.next();
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 12\.5px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0.2;/);
      MockNow.tick(delay / 2);
      MockRaf.next();
      expect('.modal-dialog').not.toExist();
      expect('.modal-backdrop').not.toExist();
    });

    it('does not animate if animation is false', () => {
      subject::setProps({animation: false});
      expect('.modal-dialog').toHaveAttr('style', /margin-top: 50px;/);
      expect('.modal-backdrop').toHaveAttr('style', /opacity: 0.8;/);
      subject::setProps({show: false});
      expect('.modal-dialog').not.toExist();
      expect('.modal-backdrop').not.toExist();
    });
  });

  describe('onHide', function() {
    let onHide;

    beforeEach(function() {
      onHide = jasmine.createSpy('onHide');
      subject = ReactDOM.render(
        <BaseModal show id="ms-modal" onHide={onHide} animation={false}/>,
        root
      );
    });

    it('is triggered when close button is clicked', function() {
      $('#ms-modal button.close').simulate('click');
      expect(onHide).toHaveBeenCalled();
    });

    it('is not triggered when the modal content itself is clicked', () => {
      $('.modal-dialog').simulate('click');
      expect(onHide).not.toHaveBeenCalled();
      $('.modal-content').simulate('click');
      expect(onHide).not.toHaveBeenCalled();
    });

    it('is triggered when the backdrop', () => {
      $('.modal').simulate('click');
      expect(onHide).toHaveBeenCalled();
    });

    it('is triggered on esc key down', () => {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('keydown', true, true);
      evt.keyCode = BaseModal.ESC_KEY;
      document.documentElement.dispatchEvent(evt);
      expect(onHide).toHaveBeenCalled();
    });

    it('is not triggered on esc key down if keyboard is false', () => {
      subject::setProps({keyboard: false});
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('keydown', true, true);
      evt.keyCode = BaseModal.ESC_KEY;
      document.documentElement.dispatchEvent(evt);
      expect(onHide).not.toHaveBeenCalled();
    });

    it('cleans up keydown listeners', () => {
      ReactDOM.unmountComponentAtNode(root);
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('keydown', true, true);
      evt.keyCode = BaseModal.ESC_KEY;
      document.documentElement.dispatchEvent(evt);
      expect(onHide).not.toHaveBeenCalled();
    });
  });

  describe('focusing', () => {
    beforeEach(() => {
      $('body').append('<input type="text" tabIndex="-1" class="i-was-here-first">');
      $('.i-was-here-first').focus();
      expect('.i-was-here-first').toBeFocused();
      subject = ReactDOM.render(
        <BaseModal show id="ms-modal" animation={false}/>,
        root
      );
      jasmine.clock().tick(1);
    });

    afterEach(() => {
      $('.i-was-here-first').remove();
    });

    it('steals focus on open', () => {
      expect('.modal').toBeFocused();
      expect('.i-was-here-first').not.toBeFocused();
    });
  });

  describe('onEntered/onExited', () => {
    describe('with animation', () => {
      let delay, onEnterSpy, onExitSpy;
      beforeEach(() => {
        delay = BaseModal.ANIMATION_TIME;
        onEnterSpy = jasmine.createSpy('onEnter');
        onExitSpy = jasmine.createSpy('onExit');
        subject = ReactDOM.render(
          <BaseModal show id="mr-modal" title="hey mr modal" animation={true} onExited={onExitSpy}
                     onEntered={onEnterSpy}/>,
          root
        );
      });

      it('calls on entered when the shown animations are complete', () => {
        expect(onEnterSpy).not.toHaveBeenCalled();
        expect(onExitSpy).not.toHaveBeenCalled();
        MockNow.tick(delay);
        MockRaf.next();
        expect(onEnterSpy).toHaveBeenCalled();
        expect(onExitSpy).not.toHaveBeenCalled();
      });

      it('calls on exited when the closing animations are complete', () => {
        MockNow.tick(delay);
        MockRaf.next();
        onEnterSpy.calls.reset();
        subject::setProps({show: false});
        MockNow.tick(delay);
        MockRaf.next();
        expect(onEnterSpy).not.toHaveBeenCalled();
        expect(onExitSpy).toHaveBeenCalled();
      });
    });
  });

  describe('sizing', () => {
    beforeEach(() => {
      subject = ReactDOM.render(
        <BaseModal show id='ms-modal' animation={false}/>,
        root
      );
    });

    it('can set the small (sm) size', () => {
      subject::setProps({size: 'sm'});
      expect('.modal-dialog').toHaveClass('modal-sm');
    });

    it('can set the small size', () => {
      subject::setProps({size: 'small'});
      expect('.modal-dialog').toHaveClass('modal-sm');
    });

    it('can set the large (lg) size', () => {
      subject::setProps({size: 'lg'});
      expect('.modal-dialog').toHaveClass('modal-lg');
    });

    it('can set the large size', () => {
      subject::setProps({size: 'large'});
      expect('.modal-dialog').toHaveClass('modal-lg');
    });
  });

  it('supports dialog className', () => {
    ReactDOM.render(
      <BaseModal show id="ms-modal" animation={false} dialogClassName="some-class-name"/>,
      root
    );
    expect('.modal-dialog').toHaveClass('some-class-name');
  });
});

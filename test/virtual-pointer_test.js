(function($) {

	/** test suite */

	describe('Virtual Pointer', function() {
		before(function() {
			this.pointer = VirtualPointer(this);

			// adjusting time values for testing purposes
			this.pointer.DOUBLETAP_DURATION = 25;
			this.pointer.PRESS_DURATION = 25;
			this.pointer.FLICK_DURATION = 25;

			// ensure we are at the top
			window.scrollTo(0, 0);
			// prevent mocha from scrolling
			window.scrollTo = $.noop;
			// prevent user from scrolling
			$('body').css('overflow', 'hidden');

			// XXX: phantomjs does not implement Function#bind: https://github.com/ariya/phantomjs/issues/10522
			if (window.PHANTOMJS) {
				Function.prototype.bind = function(scope) {
					var self = this;
					return function() {
						self.apply(scope, arguments);
					}
				};
			}
		});

		after(function() {
			// re-enable scrolling
			$('body').css('overflow', 'auto');
		});

		afterEach(function() {
			$('html, body').off();
		});

		describe('tap start', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT, handler);
				this.pointer.tapStart();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT, 'body', handler);
				this.pointer.tapStart();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with target element', function() {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT, handler);
				this.pointer.tapStart($('.target'));
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn($('.target')[0]);
			});
		});

		describe('tap end', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				$('body').on(this.pointer.STOP_EVENT, handler);
				this.pointer.tapEnd();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('html').on(this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.tapEnd();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with target element', function() {
				var handler = sinon.spy();
				$('.target').on(this.pointer.STOP_EVENT, handler);
				this.pointer.tapEnd($('.target'));
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn($('.target')[0]);
			});
		});

		describe('move', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				$('body').on(this.pointer.MOVE_EVENT, handler);
				this.pointer.move(100, 100, 25, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('html').on(this.pointer.MOVE_EVENT, 'body', handler);
				this.pointer.move(100, 100, 25, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with target element', function(done) {
				var handler = sinon.spy();
				$('.target').on(this.pointer.MOVE_EVENT, handler);
				this.pointer.move($('.target'), 25, function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn($('.target')[0]);
					done();
				}.bind(this));
			});
		});

		describe('click', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				$('body').on('click', handler);
				this.pointer.click();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('html').on('click', 'body', handler);
				this.pointer.click();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with target element', function() {
				var handler = sinon.spy();
				$('.target').on('click', handler);
				this.pointer.click($('.target'));
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn($('.target')[0]);
			});
		});

		describe('tap', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.tap();
				handler.should.have.been.calledTwice;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.tap();
				handler.should.have.been.calledTwice;
				handler.should.have.been.calledOn(document.body);
			});

			it('should work with target element', function() {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.tap($('.target'));
				handler.should.have.been.calledTwice;
				handler.should.have.been.calledOn($('.target')[0]);
			});
		});

		describe('press', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.press(function() {
					handler.should.have.been.calledTwice;
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.press(function() {
					handler.should.have.been.calledTwice;
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with target element', function(done) {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.press(function() {
					handler.should.have.been.calledTwice;
					handler.should.have.been.calledOn($('.target')[0]);
					done();
				}, 0, $('.target'));
			});
		});

		describe('double tap', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.doubleTap(function() {
					handler.callCount.should.equal(4);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.doubleTap(function() {
					handler.callCount.should.equal(4);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with target element', function(done) {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.doubleTap(function() {
					handler.callCount.should.equal(4);
					handler.should.have.been.calledOn($('.target')[0]);
					done();
				}, 0, $('.target'));
			});
		});

		describe('drag', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.drag(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.drag(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with target element', function(done) {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.drag($('.target'), function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn($('.target')[0]);
					done();
				});
			});
		});

		describe('flick', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				$('body').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.flick(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('html').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, 'body', handler);
				this.pointer.flick(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(document.body);
					done();
				});
			});

			it('should work with target element', function(done) {
				var handler = sinon.spy();
				$('.target').on(this.pointer.START_EVENT + ' ' + this.pointer.MOVE_EVENT + ' ' + this.pointer.STOP_EVENT, handler);
				this.pointer.flick($('.target'), function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn($('.target')[0]);
					done();
				});
			});
		});
	});

}(jQuery));
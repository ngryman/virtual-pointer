/*global Mocha, VirtualPointer, describe, xdescribe, before, beforeEach, afterEach, it, xit, sinon*/

(function($) {

	/** test suite */

	describe('Virtual Pointer', function() {
		before(function() {
			this.pointer = VirtualPointer(this);

			// adjusting time values for testing purposes
			this.pointer.DOUBLETAP_DURATION = 25;
			this.pointer.PRESS_DURATION = 25;
			this.pointer.FLICK_DURATION = 25;
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
		});
	});

}(jQuery));
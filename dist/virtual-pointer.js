/*! virtual-pointer - v0.0.1 - 2013-07-01
* https://github.com/ngryman/virtual-pointer
* Copyright (c) 2013 Nicolas Gryman; Licensed MIT */

(function($, window) {

	var hasTouch = 'ontouchstart' in window,
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend' : 'mouseup',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove';

	$.each('click mousedown mouseup mousemove mouseleave touchstart touchmove touchend'.split(' '), function(i, evtName) {
		$.event.special[evtName] = {
			add: function(handleObj) {
				var oldHandler = handleObj.handler;
				handleObj.handler = function(event) {
					if (event.isTrigger) {
						oldHandler.apply(this, arguments);
					}
				};
			}
		};
	});

	window.VirtualPointer = function(scope) {
		return {
			x: 0,
			y: 0,
			autoReset: true,

			trigger: function(evtName) {
				var $el = $(document.elementFromPoint(this.x, this.y));
				$el.trigger(new $.Event(evtName, {
					pageX: this.x,
					pageY: this.y,
					originalEvent: {
						touches: [
							{
								pageX: this.x,
								pageY: this.y
							}
						]
					}
				}));
			},

			tapStart: function(target) {
				if (this.autoReset) {
					this.x = this.y = 0;
				}
				if (target) {
					var pos = $(target).offset();
					this.x = pos.left;
					this.y = pos.top;
				}
				this.trigger(startEvent);
			},

			tapEnd: function(target) {
				if (target) {
					var pos = $(target).offset();
					this.x = pos.left;
					this.y = pos.top;
				}
				this.trigger(stopEvent);
			},

			click: function(target) {
				if (target) {
					var pos = $(target).offset();
					this.x = pos.left;
					this.y = pos.top;
				}
				this.trigger('click');
			},

			move: function(x, y, duration, callback) {
				var last = Date.now(), t = 0, timer, pos;

				// juggling
				if ('number' != typeof x) {
					callback = duration;
					duration = y;
					pos = $(x).offset();
					x = pos.left;
					y = pos.top;
				}

				this.tapStart();

				var sx = this.x, sy = this.y;
				(function mv() {
					var now = Date.now();
					t += now - last;
					if (t > duration) {
						if (x != this.x || y != this.y) {
							this.x = sx + x;
							this.y = sy + y;
							this.trigger(moveEvent);
						}
						this.tapEnd();
						callback && callback.call(scope);
						return;
					}
					last = now;

					this.x = Math.ceil(t / duration * x) + sx;
					this.y = Math.ceil(t / duration * y) + sy;

					this.trigger(moveEvent);
					timer = setTimeout(mv.bind(this), 0);
				}.bind(this))();
			},

			tap: function(target) {
				this.tapStart(target);
				this.tapEnd(target);
			},

			press: function(callback, duration, target) {
				duration = duration || this.PRESS_DURATION * 1.5 /* security */;
				this.tapStart(target);
				setTimeout(function() {
					this.tapEnd(target);
					callback && callback.call(scope);
				}.bind(this), duration);
			},

			doubleTap: function(callback, duration, target) {
				duration = duration || this.DOUBLETAP_DURATION * 0.5 /* security */;
				this.tap(target);
				setTimeout(function() {
					this.tap(target);
					callback && callback.call(scope);
				}.bind(this), duration);
			},

			drag: function(x, y, callback, duration) {
				var pos;

				// juggling
				if ('number' != typeof x) {
					duration = callback;
					callback = y;
					pos = $(x).offset();
					x = pos.left;
					y = pos.top;
				}

				duration = duration || this.FLICK_DURATION * 1.5 /* security */;
				this.move(x, y, duration, callback);
			},

			flick: function(x, y, callback, duration) {
				var pos;

				// juggling
				if ('number' != typeof x) {
					duration = callback;
					callback = y;
					pos = $(x).offset();
					x = pos.left;
					y = pos.top;
				}

				duration = duration || this.FLICK_DURATION * 0.5 /* security */;
				this.move(x, y, duration, callback);
			},

			START_EVENT: startEvent,
			STOP_EVENT: stopEvent,
			MOVE_EVENT: moveEvent,

			PRESS_DURATION: 25,
			DOUBLETAP_DURATION: 25,
			FLICK_DURATION: 25
		};
	};

})(jQuery, window);
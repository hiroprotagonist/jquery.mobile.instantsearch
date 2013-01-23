/*
 * jquery.mobile.actionsheet v2
 *
 * Copyright (c) 2011, Stefan Gebhardt
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * Date: 2011-05-03 17:11:00 (Tue, 3 May 2011)
 */
(function ($, window, undefined) {
	$.widget("mobile.instantsearch", $.mobile.widget, {
		inputField: undefined, //Search inupt
		resultDisplay: undefined, //Result div
		timeout: undefined,
		options: {
			delay: 500,
			instantsearchResultboxid: null
		},
		_init: function () {
			if (this.options.instantsearchResultboxid !== null) {
				this.resultDisplay = $('#' + this.options.instantsearchResultboxid);
			} else {
				this.resultDisplay = $('<div>');
				this.element.after(this.resultDisplay);
			}

			this.element.submit(function () {
				return false;
			});
			this.element.bind('search', $.proxy(this.delaysearch, this));

			this.inputField = this.element.find(':jqmData(type="search")');
			this.inputField.bind('keyup', $.proxy(this.delaysearch, this));
		},
		delaysearch: function () {
			if (typeof this.timeout !== 'undefined') {
				window.clearTimeout(this.timeout);
			}
			this.timeout = window.setTimeout($.proxy(this.submit, this), this.options.delay);
		},
		submit: function () {
			$.ajax({
				url: this.element.attr('action'),
				context: this,
				dataType: 'html',
				type: this.element.attr('method'),
				data: this.element.serialize(),
				beforeSend: function () {
					this.inputField.addClass('loading');
				},
				complete: function () {
					this.inputField.removeClass('loading');
				},
				success: function (html) {
					var content = $(html);
					this.resultDisplay.html(content);
					// Enhance the content if necessary
					if ( typeof(content.attr('data-role')) !== 'undefined' ) {
						var pluginName = content.attr('data-role');
						content[pluginName]();
					}
					
					// Enhance the children of content if necessary
					$.each(content.find('[data-role]'), function() {
						var item = $(this)
						  , pluginName = item.attr('data-role');
						if ( typeof item[pluginName] === 'function' ) { 
							item[pluginName]();
						}
					});
				}
			});
		}
	});

	$(":jqmData(role='page')").live("pageinit", function () {
		$(":jqmData(role='instantsearch')", this).each(function () {
			$(this).instantsearch();
		});
	});
})(jQuery, this);

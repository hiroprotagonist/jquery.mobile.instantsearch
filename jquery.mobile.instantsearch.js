/*
 * jquery.mobile.actionsheet v1
 *
 * Copyright (c) 2011, Stefan Gebhardt
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * Date: 2011-05-03 17:11:00 (Tue, 3 May 2011)
 * Revision: 1.1
 */
(function($, window, undefined) {
	$.widget("mobile.instantsearch", $.mobile.widget, {
		si: undefined,	//search inupt
		rd: undefined,	//result div
		timeout: undefined,
		options: {
			delay: 500
		},
		_init: function() {
			this.rd= $("<div>");
			this.element.after(this.rd);
			this.si= this.element.find(":jqmData(type='search')");
			this.element.submit(function() {
				return false;
			});
			this.si.bind('keyup', $.proxy(this.delaysearch, this));
		},
		delaysearch: function() {
			if(typeof this.timeout !== 'undefined') {
				window.clearTimeout(this.timeout);
			}
			this.timeout= window.setTimeout($.proxy(this.submit, this), this.options.delay);
		},
		submit: function() {
			$.ajax({
				url: this.element.attr('action'),
				context: this,
				dataType: 'html',
				type: this.element.attr('method'),
				data: this.element.serialize(),
				beforeSend: function() {
					this.si.addClass('loading');
				},
				complete: function() {
					this.si.removeClass('loading');
				},
				success: function(html) {
					var ul= $(html);
					this.rd.html(ul);
					this.rd.children('ul').listview();
				}
			});
		}
	});

	$(":jqmData(role='page')").live("pageinit", function() {
		$(":jqmData(role='instantsearch')", this).each(function() {
			$(this).instantsearch();
		});
	});
}) (jQuery, this);

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
			this.element.bind('clearResult', $.proxy(this.clearResult, this));
			
			// Clear resultbox when the clear button of a search input is clicked
			$('.ui-input-clear', this.element).bind('click', $.proxy(this.clearResult, this));
			
			this.inputField = this.element.find(':jqmData(type="search")');
			this.inputField.bind('keyup', $.proxy(this.delaysearch, this));
		},
		delaysearch: function () {
			if (typeof this.timeout !== 'undefined') {
				window.clearTimeout(this.timeout);
			}
			this.timeout = window.setTimeout($.proxy(this.submit, this), this.options.delay);
		},
		clearResult: function () {
			this.resultDisplay.empty();
		},
		submit: function () {
			$.ajax({
				url: this.element.attr('action'),
				context: this,
				dataType: 'text',
				type: this.element.attr('method'),
				data: this.element.serialize(),
				beforeSend: function () {
					this.inputField.addClass('loading');
				},
				complete: function () {
					this.inputField.removeClass('loading');
				},
				error: function (xhr) {
					var message = "Sorry, your request could not be fullfilled.\nStatus Text:" + xhr.statusText + "\nStatus Code: " + xhr.status;
					alert( message );
				},
				success: function (html) {
					var content = $( html.trim() );
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

	$.mobile.document.bind( "pagecreate", function( e ) {
		$(":jqmData(role='instantsearch')", this).each(function () {
			$(this).instantsearch();
		});
	});
})(jQuery, this);
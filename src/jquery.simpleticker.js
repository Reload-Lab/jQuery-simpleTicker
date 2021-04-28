/***
 * Name: jQuery simpleticker plugin
 * Vesion: 1.0.1
 * Author: Domenico Gigante
 * Repository: https://github.com/Reload-Lab/jQuery-simpleTicker
 ***/

(function($){
	
	$.fn.simpleticker = function(options){
		
		var directions = [
			'horizontal',
			'vertical'
		];
		
		var booleans = [
			0,
			1
		];
		
		// Setup default settings
		var defaults = $.extend(
			{
				velocity: 1,
				forward: true,
				direction: 'horizontal', // vertical
				nodes: '.item',
				wrapper: '.item-wrap',
				pause: true,
				complete: null
			},
			options
		);
		
		this.each(function(){
			
			/*** data settings ***/
			// merge default config with element setting
			var settings = $.extend({}, defaults); 
			
			// data: velocity
			if(typeof $(this).data('stVelocity') == 'number' && $(this).data('stVelocity') > 0){
			
				settings.velocity = $(this).data('stVelocity');
			}
			
			// data: forward
			if(typeof $(this).data('stForward') == 'boolean' || booleans.indexOf($(this).data('stForward')) != -1){
			
				settings.forward = !!$(this).data('stForward');
			}
			
			// data: direction
			if(typeof $(this).data('stDirection') == 'string' && directions.indexOf($(this).data('stDirection')) != -1){
			
				settings.direction = $(this).data('stDirection');
			}
			
			// data: nodes
			if(typeof $(this).data('stNodes') == 'string' && $($(this).data('stNodes')).length){
			
				settings.nodes = $(this).data('stNodes');
			}
			
			// data: wrapper
			if(typeof $(this).data('stWrapper') == 'string' && $($(this).data('stWrapper')).length){
			
				settings.wrapper = $(this).data('stWrapper');
			}
			
			// data: pause
			if(typeof $(this).data('stPause') == 'boolean' || booleans.indexOf($(this).data('stPause')) != -1){
			
				settings.pause = !!$(this).data('stPause');
			}
			
			/*** set init variables ***/
			var curPos; // current position
			var reqAF; // requestAnimationFrame
			var el = this; // this ticker
			var t0; // initial translation
			var t1; // final translation
			var w; // ticker width/height
			var v = settings.velocity; // velocity
			var W = settings.direction == 'vertical'? $(el).height(): $(el).width(); // container width/height
			var t = settings.direction == 'vertical'? 'translateY': 'translateX'; // translation
			
			/*** window onresize ***/
			window.addEventListener('resize', function(){
				
				// update some variables
				if(settings.forward){
					
					t0 = -w; // initial translation
					t1 = 0; // final translation
				} else{
					
					W = settings.direction == 'vertical'? $(el).height(): $(el).width(); // container width/height
					
					t0 = -(w - W); // initial translation
					t1 = -(2 * w - W); // final translation
				}
			});
			
			/*** init setup ***/
			// ticker container must be flex
			$(el).css({
				'display': 'flex'
			});
			
			// if forward
			if(settings.forward){
				
				if(settings.direction == 'vertical'){
					
					// ticker container must be flex column
					$(el).css({
						'flex-direction': 'column',
					});
			
					// ticker height
					// wrapper must be flex column
					w = $(el).find(settings.wrapper)
						.css({
							'display': 'flex',
							'flex-direction': 'column',
							'flex-wrap': 'nowrap',
							'white-space': 'wrap'
						})
						.height();
				} else{
					
					// ticker width
					// wrapper must be flex row
					w = $(el).find(settings.wrapper)
						.css({
							'display': 'flex',
							'flex-direction': 'row',
							'flex-wrap': 'nowrap',
							'white-space': 'nowrap'
						})
						.width();
				}
				
				t0 = -w; // initial translation
				t1 = 0; // final translation
				
				// set actual position
				curPos = t0;
				
				// clone child nodes and prepend to child wrapper
				$(el).find(settings.wrapper)
					.each(function(index, elem){
						
						$($(elem).find($(settings.nodes).get().reverse()))
							.each(function(){
							
								$(this).clone()
									.prependTo(elem);
							});
					});
			} else{
				
				if(settings.direction == 'vertical'){
					
					// ticker container must be flex column
					$(el).css({
						'flex-direction': 'column',
					});
			
					// ticker height
					// wrapper must be flex column
					w = $(el).find(settings.wrapper)
						.css({
							'display': 'flex',
							'flex-direction': 'column',
							'flex-wrap': 'nowrap',
							'white-space': 'wrap'
						})
						.height();
				} else{
					
					// ticker width
					// wrapper must be flex row
					w = $(el).find(settings.wrapper)
						.css({
							'display': 'flex',
							'flex-direction': 'row',
							'flex-wrap': 'nowrap',
							'white-space': 'nowrap'
						})
						.width();
				}
				
				t0 = -(w - W); // initial translation
				t1 = -(2 * w - W); // final translation
		  	
				// set actual position
				curPos = t0
				
				// clone child nodes and append to child wrapper
				$(el).find(settings.wrapper)
					.each(function(index, elem){
						
						$(elem).find(settings.nodes)
							.each(function(){
								
								$(this).clone()
									.appendTo(elem);
							});
					});
			}
			
			/*** move ticker by step ***/
			function step(){
				
				if(settings.forward){
					
					// if actual position is minus or equal to zero,
					// go ahead
					if(curPos <= t1){
						
						curPos = curPos + 1 * v;
						
						$(el).find(settings.wrapper)
							.css('transform', t + '(' + curPos + 'px)');
					}
					// else set actual position to start position
					else{
						
						$(el).find(settings.wrapper)
							.css('transform', t + '(' + t0 + ')');
						
						curPos = t0;
					
						// call complete function
						if($.isFunction(settings.complete)){
							
							settings.complete.call(this, el);
						}
					}
				} else{
					
					// if actual position is major or equal to end position,
					// go ahead
					if(curPos >= t1){
						
						curPos = curPos - 1 * v;
						
						$(el).find(settings.wrapper)
							.css('transform', t + '(' + curPos + 'px)');
					}
					// else set actual position to start position
					else{
						
						$(el).find(settings.wrapper)
							.css('transform', t + '(' + t0 + ')');
						
						curPos = t0;
						
						// call complete function
						if($.isFunction(settings.complete)){
							
							settings.complete.call(this, el);
						}
					}
				}
	
				reqAF = window.requestAnimationFrame(step);
			}
	
			reqAF = window.requestAnimationFrame(step);
			
			/*** manage pause on hover ***/
			if(settings.pause){
				
				$(el).hover(
					function(){
						
						// on mouse over
						// stop animation
						window.cancelAnimationFrame(reqAF);
					},
					function(){
						
						// on mouse out
						// restart animation
						reqAF = window.requestAnimationFrame(step);
					}
				);
			}
		});
	}
})(jQuery);

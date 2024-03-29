/*!
 * jQuery simpleTicker Plugin
 * https://github.com/Reload-Lab/jQuery-simpleTicker
 *
 * @updated September 29, 2023
 * @version 1.0.0
 *
 * @author Domenico Gigante <domenico.gigante@reloadlab.it>
 * @copyright (c) 2023 Reload Laboratorio Multimediale <info@reloadlab.it> (https://www.reloadlab.it)
 * @license MIT
 */

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
				
				resize();
			});
			
			/*** init setup ***/
			(function init(){
					
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
					
					// clone child nodes and prepend to child wrapper
					$(el).find(settings.wrapper)
						.each(function(index, elem){
							
							$($(elem).find($(settings.nodes).get().reverse()))
								.each(function(){
								
									$(this).clone()
										.addClass('cloned')
										.prependTo(elem);
								});
						});
					
					if(w < W){
						
						t0 = -w; // initial translation
						t1 = W; // final translation
					
						// set actual position
						curPos = t0
						
						// hide cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', 'none');
									});
							});
					} else{
						
						t0 = -w; // initial translation
						t1 = 0; // final translation
						
						// set actual position
						curPos = t0;
					}
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
					
					// clone child nodes and append to child wrapper
					$(el).find(settings.wrapper)
						.each(function(index, elem){
							
							$(elem).find(settings.nodes)
								.each(function(){
									
									$(this).clone()
										.addClass('cloned')
										.appendTo(elem);
								});
						});
					
					if(w < W){
						
						t0 = W; // initial translation
						t1 = -w; // final translation
					
						// set actual position
						curPos = t0
						
						// hide cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', 'none');
									});
							});
					} else{
					
						t0 = -(w - W); // initial translation
						t1 = -(2 * w - W); // final translation
					
						// set actual position
						curPos = t0
					}
				}
			})();
			
			function resize(){
				
				W = settings.direction == 'vertical'? $(el).height(): $(el).width(); // container width/height
				
				// update some variables
				if(settings.forward){
					
					if(w < W){
						
						t0 = -w; // initial translation
						t1 = W; // final translation
						
						// hide cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', 'none');
									});
							});
					} else{
						
						t0 = -w; // initial translation
						t1 = 0; // final translation
						
						// show cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', "");
									});
							});
					}
				} else{
					
					if(w < W){
						
						t0 = W; // initial translation
						t1 = -w; // final translation
						
						// hide cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', 'none');
									});
							});
					} else{
						
						t0 = -(w - W); // initial translation
						t1 = -(2 * w - W); // final translation
						
						// show cloned nodes
						$(el).find(settings.wrapper)
							.each(function(index, elem){
								
								$(elem).find(settings.nodes + '.cloned')
									.each(function(){
										
										$(this).css('display', "");
									});
							});
					}
				}
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

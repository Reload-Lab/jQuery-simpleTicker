/***
 * Name: jQuery simpleticker plugin
 * Vesion: 1.0.0
 * Author: Domenico Gigante
 * Repository: https://github.com/Reload-Lab/jQuery-simpleTicker
 ***/

(function($){
	
	$.fn.extend({
		
		simpleticker: function(options){
			
			// Setup default settings
			var settings = $.extend(
				{
					velocity: 1,
					forward: true,
					childNode: '.item',
					childWrapper: '.item-wrap',
					pauseOnHover: true,
					complete: null
				},
				options
			);

			var curXPos;
			var myReq;
			var el = this;
			var x0;
			var x1;
			var w0;
			var v = settings.velocity; // velocity
			var W = $(el).width();
			
			window.addEventListener('resize', function(){
				
				if(settings.forward){
					
					x0 = -1 * w0;
					x1 = 0;
				} else{
					
					W = $(el).width();
					
					x0 = -1 * (w0 - W);
					x1 = -1 * (2 * w0 - W);
				}
			});
			
			if(settings.forward){
				
				w0 = $(el).find(settings.childWrapper).width();
				
				x0 = -1 * w0;
				x1 = 0;
				
				curXPos = x0;

				$(el).each(function(index, elem){
					
					$(elem).find(settings.childWrapper)
						.each(function(index, elem){
							
							$($(elem).find($(settings.childNode).get().reverse()))
								.each(function(){
								
									$(this).clone()
										.prependTo(elem);
								});
						});
				});
			} else{
				
				w0 = $(el).find(settings.childWrapper).width();
				
				x0 = -1 * (w0 - W);
				x1 = -1 * (2 * w0 - W);
		  
				if($(el).find(settings.childWrapper).css('transform') !== 'none'){
					
					curXPos = $(el).find(settings.childWrapper)
						.css('transform')
						.split(/[()]/)[1]
						.split(',')[4];
				} else{
					
					curXPos = 0;
				}

				$(el).each(function(index, elem){
					
					$(elem).find(settings.childWrapper)
						.each(function(index, elem){
							
							$(elem).find(settings.childNode)
								.each(function(){
									
									$(this).clone()
										.appendTo(elem);
								});
						});
				});
			}
			
			function step(){
				
				if(settings.forward){
					
					if(curXPos <= 0){
						
						curXPos = curXPos + 1 * v;
						
						$(el).find(settings.childWrapper)
							.css('transform', 'translateX(' + curXPos + 'px)');
					} else{
						
						$(el).find(settings.childWrapper)
							.css('transform', 'translateX(' + x0 + ')');
						
						curXPos = x0;
					}
				} else{
					
					if(curXPos >= x1){
						
						curXPos = curXPos - 1 * v;
						
						$(el).find(settings.childWrapper)
							.css('transform', 'translateX(' + curXPos + 'px)');
					} else{
						
						$(el).find(settings.childWrapper)
							.css('transform', 'translateX(' + x0 + ')');
						
						curXPos = x0;
					}
				}

				myReq = window.requestAnimationFrame(step);
			}

			myReq = window.requestAnimationFrame(step);

			if(settings.pauseOnHover){
				
				$(this).hover(
					function(){
						
						cancelAnimationFrame(myReq);
					},
					function(){
						
						myReq = window.requestAnimationFrame(step);
					}
				);
			}

			return this.each(function(){
				
				if($.isFunction(settings.complete)){
					
					settings.complete.call(this);
				}
			});
		}
	});
})(jQuery);

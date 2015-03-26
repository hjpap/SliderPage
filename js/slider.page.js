(function(window){
	var AnimationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	var hasTouch='ontouchstart' in window;
	//hasTouch = false;
	////event
	var RESIZE_EVENT='onorientationchange' in window ?'orientationchange':'resize';
	var START_EVENT= hasTouch?'touchstart':"mousedown";
	var MOVE_EVENT=hasTouch?'touchmove':'mousemove';
	var END_EVENT=hasTouch?'touchend':'mouseup';
	var CANCEL_EVENT=hasTouch?'touchcancel':'mouseup';
	var CLICK_EVENT=hasTouch?'click':'touchend';
	////end event
	
	
	var SliderPage = function(){
		var that = this,
		prefix = 'p_',
		pageLength = 0,
		current = null,
		audioContr=null;

		that.event = {
			RESIZE_EVENT:RESIZE_EVENT,
			START_EVENT:START_EVENT,
			MOVE_EVENT:MOVE_EVENT,
			END_EVENT:END_EVENT
		}
		
		that.down = false;
		that.startEvent = function(e){
			that.down = true;
			var startY=null,endY=null,endE;
			var point=hasTouch?e.changedTouches[0]:e;
			startY = point.pageY;
			/*$(document).bind(MOVE_EVENT,function(e){
				var point=hasTouch?e.touches[0]:e;
						point.pageY
			});*/
			document.addEventListener(END_EVENT,endE = function(e){
				var point=hasTouch?e.changedTouches[0]:e;
				endY = point.pageY;
				if(that.down){
					var fx = endY-startY>40?'top':endY-startY<-40?'bottom':null;
					if(fx == 'top'){
						that.pre('top');
					}else if(fx == 'bottom'){
						that.next('bottom');
					}
				}
				that.down = false;
				document.removeEventListener(END_EVENT,endE,false);
			},false);
		}

		that.switch = function(index,pos){
			if(!index || index == current)return;
			if(current){
				var prePage = $('#'+prefix+current);
				var preCls = 'slideAnimated ';
				var attr = pos+'-out';
				var outCls = prePage.attr(attr);
				preCls = preCls+outCls;
				prePage.css('z-index' ,1);
				prePage.show().addClass(preCls).one(AnimationEnd, function(){
					prePage.css('z-index' ,1);
					prePage[0].removeEventListener(START_EVENT,that.startEvent,false);
					setTimeout(function(){
						prePage.removeClass(preCls);
						prePage.hide();
					},250);
				});
			}
			current = index;
			var page = $('#'+prefix+index);
			var stepDom = page.find('.animate-dom');
			var cls = 'slideAnimated ';
			var attr = pos+'-in'
			var inCls = page.attr(attr);
			cls = cls+inCls;
			stepDom.each(function(){
				$(this).hide();
			});
			page.css('z-index' ,999);
			page.show().addClass(cls).one(AnimationEnd,function(){
					var sCls = cls;
					page.removeClass(sCls);
					page[0].addEventListener(START_EVENT,that.startEvent,false);
					stepDom.each(function(){
						var stp = $(this);
						var stepCls = 'animated ';
						var inCls = stp.attr('in');
						stepCls=stepCls+inCls;
						var delay = stp.attr('delay');
						delay = Number(delay);
						var showStepDom = function(){
							stp.show().addClass(stepCls).one(AnimationEnd,function(){
								stp.removeClass(stepCls);
							});
						}
						if(delay){
							setTimeout(showStepDom,delay);
						}else{
							showStepDom();
						}
					});
			});
		}

		that.pre = function(pos){
			var index = current-1==0?pageLength:(current-1);
			that.switch(index,pos);
		}

		that.next = function(pos){
			var index = current+1>pageLength?1:(current+1);
			that.switch(index,pos);
		}
		
		that.playing = false;
		that.play= function(src){
			if(!that.audioContr)_f.initAudio();
			if(src){
				that.audioContr.src = src;
				that.audioContr.play();
			}else{
				that.audioContr.play();
			}
			that.playing = true;
			$('#music-box>i').addClass('music-icon-cir');
		}
		
		that.pause= function(){
			that.playing = false;
			if(that.audioContr)that.audioContr.pause();
			$('#music-box>i').removeClass('music-icon-cir');
		}
		
		var _f = {
			init: function(){
				pageLength = $('.slider-page-host>li').length;
				this.initAudio();
				this.show();
			},
			show: function(){
				current = 1;
				var page = $('#'+prefix+'1');
				var stepDom = page.find('.animate-dom');
				page.css('display','block');
				stepDom.each(function(){
					$(this).hide();
				});
				page[0].addEventListener(START_EVENT,that.startEvent,false);
				stepDom.each(function(){
					var stp = $(this);
					var stepCls = 'animated ';
					var inCls = stp.attr('in');
					stepCls=stepCls+inCls;
					var delay = stp.attr('delay');
					delay = Number(delay);
					var showStepDom = function(){
						stp.show().addClass(stepCls).one(AnimationEnd,function(){
							stp.removeClass(stepCls);
						});
					}
					if(delay){
						setTimeout(showStepDom,delay);
					}else{
						showStepDom();
					}
				});
			},
			initAudio: function(){
				that.audioContr = $('#audioControl')[0];
				$('#music-box')[0].addEventListener(START_EVENT,function(){
					if(that.playing){
						that.pause();
					}else{
						that.play();
					}
				},false);
			}
		}
		_f.init();

	}
	
	/*setTimeout(function(){
		sliderPage.switch(3,'top');
	},1000);*/
	//sliderPage.switch(9,'top');
	window.SliderPage = SliderPage;
})(window);
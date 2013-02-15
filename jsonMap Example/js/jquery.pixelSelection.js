/*!
 * jQuery Pixel Selection
 * http://www.cw-internetdienste.de/
 *
 * Version 0.1
 *
 * Copyright 2010, Christian Weber
 * Free for commercial and
 * non-commercial use. Please shoot
 * me an email if you use it. Would love
 * to see it in action. :)
 *
 * Date: Sun May 9 18:18:12 2010 +0100
 */
  
 (function($) {
 	$.fn.pixelSelect = function(options) {
 		$.fn.pixelSelect.defaults = {
 			click:$.fn.pixelSelect.clickFunc,
 			over:$.fn.pixelSelect.overFunc,
 			out:$.fn.pixelSelect.outFunc,
 			detail:false,
 			detailStep:20
 		};
 		
 		var config = $.extend(true,$.fn.pixelSelect.defaults,options);
 		
 		var obj = $(this);
 		var canvas;
 		var cx;
 		var po = obj.offset();
 		var of = obj.position();
 		var pos = obj.css('left');
 		var zobjects = new Array();

 		var img = new Image();
 		img.onload=function() {
 			cx.drawImage(img,0,0);
 		}
 		
 		$.fn.pixelSelect.initPixelSelect = function() {
 			var cv = $('<canvas id="cv_'+obj.attr('id')+'" width="'+obj.outerWidth()+'" height="'+obj.outerHeight()+'"></canvas>').appendTo('body').css('width',obj.outerWidth()+'px').css('height',obj.outerHeight()+'px').css('border','3px solid #990000').css('display','none');
			canvas = cv.get(0);
 			if(!canvas.getContext) { alert('no context'); return false; }
 			cx = canvas.getContext('2d');
 			img.src = obj.attr('src');
 			zobjects = new Array();
 			if(config.detail) { $.fn.pixelSelect.getAllDetail(config.detailStep); } else { $.fn.pixelSelect.getAll((of.left+(obj.width()/2)),(of.top+(obj.height()/2))); }
 			obj.addClass('object');
 			obj.mousemove($.fn.pixelSelect.over);
 			obj.click($.fn.pixelSelect.clicked);
 		}
 		
 		$.fn.pixelSelect.getAll = function(x,y) {
 			var e = document.elementFromPoint(x,y);
 			if(e && e.nodeName == 'IMG') {
 				e = e.id;
 				$('#'+e).css('display','none');
 				if(e != obj.attr('id')) {
 					zobjects.push(e);
 				}
 				$.fn.pixelSelect.getAll(x,y);
 				$('#'+e).css('display','block');
 			}
 			return zobjects;
 		}
 		
 		$.fn.pixelSelect.getAllDetail = function(steps) {
 			var elements = new Array();
 			for(var x=0;x<Math.round(obj.width()/steps);x++) {
 				for(var y=0;y<Math.round(obj.height()/steps);y++) {
 					if(!$.fn.pixelSelect.pxCheck((x*steps),(y*steps),cx)) {
 						var el = $.fn.pixelSelect.getAll((po.left+(x*steps)),(po.top+(y*steps)));
 						zobjects = new Array();
 						for(var i in el) {
 							//$('p.msg').html($('p.msg').html()+'<br />#'+obj.attr('id')+'/'+$('#'+el[i]).attr('id')+': '+obj.css('z-index')+'/'+$('#'+el[i]).css('z-index'));
 							if($.fn.pixelSelect.getAllDetailStepCheck(el[i])) { elements.push(el[i]); }
 						}	
 					} 
 				}
 			}	
 			 			
 			var ob = new Array();
 			for(var i in elements) {
 				ob[$('#'+elements[i]).css('z-index')] = elements[i];
 			}
 			ob = ob.reverse();

 			zobjects = new Array();
 			for(var i in ob) {
 				zobjects[zobjects.length] = ob[i];
 			}
 		}
 		
 		$.fn.pixelSelect.getAllDetailStep = function(x,y) {
 			var e = document.elementFromPoint(x,y).id;
 			if(e) {
 				$('#'+e).css('display','none');
 				$('p.msg').html($('p.msg').html()+' / '+typeof($('#'+e).get(0)));
 				if(e != obj.attr('id')) {
 					zobjects.push(e);
 				}
 				$.fn.pixelSelect.getAll(x,y);
 				$('#'+e).css('display','block');
 			}
 			return zobjects;
 		}
 		
 		$.fn.pixelSelect.getAllDetailStepCheck = function(el) {
 			
 			for(var i in zobjects) {
 				if(zobjects[i]==el) { return false; }
 			}
 			return true;
 		}
 		
 		$.fn.pixelSelect.clicked = function(ev,sub) {
 			
 			if(sub) {
 				ev = sub[1];
 			}
 			var X = ((ev.layerX-of.left)+parseInt(obj.css('left')));
 			var Y = ((ev.layerY-of.top)+parseInt(obj.css('top')));
 			var PX = ev.clientX;
 			var PY = ev.clientY;
 			
 			if(sub) {
 				var subpos = $('#'+sub[0]).position();
 				X += (subpos.left-of.left);
 				Y += (subpos.top-of.top);
 				PX+= (subpos.left-of.left);
 				PY+= (subpos.top-of.top);
 			} else { var sub = ''; }
 			 			 			
 			if($.fn.pixelSelect.pxCheck(X,Y,cx)) {
 				// do something here
 				$('.active').removeClass('active');
 				obj.addClass('active');
 				config.click();
 			} else {
 				$('.active').removeClass('active');
 				var elem = zobjects[0];
 				if($.fn.pixelSelect.subCheck(elem,zobjects)) {
 					if(zobjects.length > 0 && typeof(sub) != 'string') { sub[zobjects[0]]; } else { sub = new Array(zobjects[0]); }
 					$('#'+zobjects[0]).trigger('click',{0:obj.attr('id'),1:ev});
 				} 
 			}
 		}
 		
 		$.fn.pixelSelect.subCheck = function(el,sub) {
 			if(sub.length == 0) { return false; }

 			return true;
 		}
 		
 		$.fn.pixelSelect.checkHide = function(s) {
 			var str = '';
 			obj.css('display','none');
 			str+=obj.attr('id')+' > ';
 			for(var el in s) {
 				$('#'+s[el]).css('display','none');
 				str+=s[el]+' > ';
 			}
 			$('p.msg').html(str);
 		}
 		
 		$.fn.pixelSelect.checkShow = function(s) {
 			obj.css('display','block');
 			for(var el in s) {
 				$('#'+s[el]).css('display','block');
 			}
 		}
 		
 		$.fn.pixelSelect.over = function(ev,sub) {
 			if(sub) {
 				ev = sub[1];
 			}
 			var X = ((ev.layerX-of.left)+parseInt(obj.css('left')));
 			var Y = ((ev.layerY-of.top)+parseInt(obj.css('top')));
 			var PX = ev.clientX;
 			var PY = ev.clientY;
 			
 			if(sub) {
 				var subpos = $('#'+sub[0]).position();
 				X += (subpos.left-of.left);
 				Y += (subpos.top-of.top);
 				PX+= (subpos.left-of.left);
 				PY+= (subpos.top-of.top);
 			} else { var sub = ''; }
 			 			 			
 			if($.fn.pixelSelect.pxCheck(X,Y,cx)) {
 				// do something here
 				//$('p.msg').html('mouse on '+obj.attr('id')+': filled ('+X+','+Y+')');
 				$('img.hovered').removeClass('hovered');
 				obj.addClass('hovered');
 				config.over;
 			} else {
 				$('.hovered').removeClass('hovered');
 				var elem = zobjects[0];
 				//$('p.msg').html('mouse on '+obj.attr('id')+': transparent ('+X+','+Y+')');
 				if($.fn.pixelSelect.subCheck(elem,zobjects)) {
 					if(zobjects.length > 0 && typeof(sub) != 'string') { sub[zobjects[0]]; } else { sub = new Array(zobjects[0]); }
 					$('#'+zobjects[0]).trigger('mousemove',{0:obj.attr('id'),1:ev});
 				}
 			}
 		}
 		
 		$.fn.pixelSelect.objectCheck = function(x,y) {
 			var el = document.elementFromPoint(x,y);
 			return el;
 		}
 		
 		$.fn.pixelSelect.pxCheck = function(x,y,cx) {
 			if(x >= 0 && x <= obj.width() && y >= 0 && y <= obj.height()) {
 				var dd = cx.getImageData(x,y,1,1);
 				if(dd.data) {
 					var d = dd.data;
 					return (d[3]===0) ? false:true;
 				} else { return false; }
 			} else {
 				return false;
 			}
 		}
 		
 		$.fn.pixelSelect.clickFunc = function() { alert('click function()'); }
 		
 		$.fn.pixelSelect.overFunc = function() { alert('over function()'); }
 		
 		$.fn.pixelSelect.outFunc = function() { alert('out function()'); }
 		
 		$.fn.pixelSelect.initPixelSelect();
 		
 		return obj;
 	};
 })(jQuery);
 
 object = function(e) {
 	var str = '';
 	for(var i in e) {
 		str+=i+': '+e[i]+'\r\n';
 	}
 	alert(str);
 }
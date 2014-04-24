// FILE: Main.js
// COPYRIGHT: GoliathDesign 2014
// THEME: Simplebyte 2014
// VERSION: 1.0
// This file holds all Javascripts (including all license information when needed. License information is provided when the script was not created and coded by GoliathDesign)

// COUNTDOWN.JS 
// VERSION: 1.1
// COPYRIGHT: GoliathDesign 2014
// YOUR NOT PERMITTED TO USE THIS FILE AS A STANDALONE OR WITH ANOTHER THEME, NOT BELONGING TO GOLIATHDESIGN

function cd() {
	"use strict";
	//Date the Countdown is set to
	var timeevent = new Date("September 01, 2014 12:00:00");
	//Defining Time and Date right now
	var now = new Date();
	//Getting the Time Difference btw. the set date and the Date now
	var timeDiff = timeevent.getTime() - now.getTime();
	//Code to be executed if countdown finished 
	if (timeDiff <= 0) {
		clearTimout(timer);
			document.write("Template Countdown finished");
			//Additional code to run when Countdown finished
	}
	//Defining Seconds, Minutes, Hours and Days 
	var seconds = Math.floor(timeDiff / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours /24);
	//Defining Variables of Days, Hours, Minutes and Seconds to determine wether to display an additional "S" or not 
	var dd = "";
	var hh = "";
	var mm = "";
	var ss = "";
	//Modulers making sure hours, minutes and seconds don't exeed their maximum (24h, 60m, 60s), passing it to the next possible variable
	hours %=24;
	minutes %= 60;
	seconds %=60;
	//Logic to determine wether to display an additional "s" or not example: 10 Days / 1 Day
	if (seconds == 1) {
		ss = "Second"; }
		else ss = "Seconds";
	if (minutes == 1) {
		mm = "Minute"; }
		else mm = "Minutes";
	if (hours == 1) {
		hh = "Hour"; }
		else hh = "Hours";
	if (days == 1) {
		dd = "Day"; }
		else dd = "Days";
	//Logic to display an additional "0" on single numbers two make it two digits long
	if (seconds <= 9) { 
		seconds = "0" + seconds; }
		else seconds = seconds;
	if (minutes <= 9) { 
		minutes = "0" + minutes; }
		else minutes = minutes;
	if (hours <= 9) { 
		hours = "0" + hours; }
		else hours = hours;
	if (days <= 9) { 
		days = "0" + days; }
		else days = days;
	
	//Output of Numbers into HTML ID
	document.getElementById("DBox").innerHTML = days;
	document.getElementById("HBox").innerHTML = hours;
	document.getElementById("MBox").innerHTML = minutes;
	document.getElementById("SBox").innerHTML = seconds;
	//Output of Labels into HTML ID
	document.getElementById("DCaption").innerHTML = dd;
	document.getElementById("HCaption").innerHTML = hh;
	document.getElementById("MCaption").innerHTML = mm;
	document.getElementById("SCaption").innerHTML = ss;
	var timer = setTimeout('cd()',1000);
}

// RETINA.JS 
// VERSION: 1.1
// COPYRIGHT: IMULUS, LLC 2013
// RELEASED UNDER THE MIT LICENSE

(function() {
	"use strict"
	var root = (typeof exports == 'undefined' ? window : exports);

	var config = {
	// Ensure Content-Type is an image before trying to load @2x image
	// https://github.com/imulus/retinajs/pull/45)
	check_mime_type: true
	};



	root.Retina = Retina;

	function Retina() {}

	Retina.configure = function(options) {
	if (options == null) options = {};
	for (var prop in options) config[prop] = options[prop];
	};

	Retina.init = function(context) {
	if (context == null) context = root;

	var existing_onload = context.onload || new Function;

	context.onload = function() {
	  var images = document.getElementsByTagName("img"), retinaImages = [], i, image;
	  for (i = 0; i < images.length; i++) {
	    image = images[i];
	    retinaImages.push(new RetinaImage(image));
	  }
	  existing_onload();
	}
	};

	Retina.isRetina = function(){
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
	                  (min--moz-device-pixel-ratio: 1.5),\
	                  (-o-min-device-pixel-ratio: 3/2),\
	                  (min-resolution: 1.5dppx)";

	if (root.devicePixelRatio > 1)
	  return true;

	if (root.matchMedia && root.matchMedia(mediaQuery).matches)
	  return true;

	return false;
	};


	root.RetinaImagePath = RetinaImagePath;

	function RetinaImagePath(path, at_2x_path) {
	this.path = path;
	if (typeof at_2x_path !== "undefined" && at_2x_path !== null) {
	  this.at_2x_path = at_2x_path;
	  this.perform_check = false;
	} else {
	  this.at_2x_path = path.replace(/\.\w+$/, function(match) { return "@2x" + match; });
	  this.perform_check = true;
	}
	}

	RetinaImagePath.confirmed_paths = [];

	RetinaImagePath.prototype.is_external = function() {
	return !!(this.path.match(/^https?\:/i) && !this.path.match('//' + document.domain) )
	}

	RetinaImagePath.prototype.check_2x_variant = function(callback) {
	var http, that = this;
	if (this.is_external()) {
	  return callback(false);
	} else if (!this.perform_check && typeof this.at_2x_path !== "undefined" && this.at_2x_path !== null) {
	  return callback(true);
	} else if (this.at_2x_path in RetinaImagePath.confirmed_paths) {
	  return callback(true);
	} else {
	  http = new XMLHttpRequest;
	  http.open('HEAD', this.at_2x_path);
	  http.onreadystatechange = function() {
	    if (http.readyState != 4) {
	      return callback(false);
	    }

	    if (http.status >= 200 && http.status <= 399) {
	      if (config.check_mime_type) {
	        var type = http.getResponseHeader('Content-Type');
	        if (type == null || !type.match(/^image/i)) {
	          return callback(false);
	        }
	      }

	      RetinaImagePath.confirmed_paths.push(that.at_2x_path);
	      return callback(true);
	    } else {
	      return callback(false);
	    }
	  }
	  http.send();
	}
	}



	function RetinaImage(el) {
	this.el = el;
	this.path = new RetinaImagePath(this.el.getAttribute('src'), this.el.getAttribute('data-at2x'));
	var that = this;
	this.path.check_2x_variant(function(hasVariant) {
	  if (hasVariant) that.swap();
	});
	}

	root.RetinaImage = RetinaImage;

	RetinaImage.prototype.swap = function(path) {
	if (typeof path == 'undefined') path = this.path.at_2x_path;

	var that = this;
	function load() {
	  if (! that.el.complete) {
	    setTimeout(load, 5);
	  } else {
	    that.el.setAttribute('width', that.el.offsetWidth);
	    that.el.setAttribute('height', that.el.offsetHeight);
	    that.el.setAttribute('src', path);
	  }
	}
	load();
	}




	if (Retina.isRetina()) {
	Retina.init(root);
	}

})();

// JQUERY.TOTEMTICKER.JS 
// VERSION: UNKNOWN
// COPYRIGHT: ZACH DUNN, WWW.BUILDINTERNET.COM 2011
// RELEASED UNDER THE MIT LICENSE

(function( $ ){
	"use strict";
	if(!$.omr){
		$.omr = new Object();
	};

	$.omr.totemticker = function(el, options ) {
	  	
	  	var base = this;
	  	
		//Define the DOM elements
	  	base.el = el;
	  	base.$el = $(el);
	  	
	  	// Add a reverse reference to the DOM object
        base.$el.data("omr.totemticker", base);
	  	
	  	base.init = function(){
            base.options = $.extend({},$.omr.totemticker.defaultOptions, options);
            
            //Define the ticker object
           	base.ticker;
			
			//Adjust the height of ticker if specified
			base.format_ticker();
			
			//Setup navigation links (if specified)
			base.setup_nav();
			
			//Start the ticker
			base.start_interval();
			
			//Debugging info in console
			//base.debug_info();
        };
		
		base.start_interval = function(){
			
			//Clear out any existing interval
			clearInterval(base.ticker);
			
	    	base.ticker = setInterval(function() {
	    	
	    		base.$el.find('li:first').animate({
	            	marginTop: '-' + base.options.row_height,
	            }, base.options.speed, function() {
	                $(this).detach().css('marginTop', '0').appendTo(base.$el);
	            });
	            
	    	}, base.options.interval);
	    }
	    
	    base.reset_interval = function(){
	    	clearInterval(base.ticker);
	    	base.start_interval();
	    }
	    
	    base.stop_interval = function(){
	    	clearInterval(base.ticker);
	    }
	
		base.format_ticker = function(){
		
			if(typeof(base.options.max_items) != "undefined" && base.options.max_items != null) {
				
				//Remove units of measurement (Should expand to cover EM and % later)
				var stripped_height = base.options.row_height.replace(/px/i, '');
				var ticker_height = stripped_height * base.options.max_items;
			
				base.$el.css({
					height		: ticker_height + 'px', 
					overflow	: 'hidden',	
				});
				
			}else{
				//No heights were specified, so just doublecheck overflow = hidden
				base.$el.css({
					overflow	: 'hidden',
				})
			}
			
		}
	
		base.setup_nav = function(){
			
			//Stop Button
			if (typeof(base.options.stop) != "undefined"  && base.options.stop != null){
				$(base.options.stop).click(function(){
					base.stop_interval();
					return false;
				});
			}
			
			//Start Button
			if (typeof(base.options.start) != "undefined"  && base.options.start != null){
				$(base.options.start).click(function(){
					base.start_interval();
					return false;
				});
			}
			
			//Previous Button
			if (typeof(base.options.previous) != "undefined"  && base.options.previous != null){
				$(base.options.previous).click(function(){
					base.$el.find('li:last').detach().prependTo(base.$el).css('marginTop', '-' + base.options.row_height);
					base.$el.find('li:first').animate({
				        marginTop: '0px',
				    }, base.options.speed, function () {
				        base.reset_interval();
				    });
				    return false;
				});
			}
			
			//Next Button
			if (typeof(base.options.next) != "undefined" && base.options.next != null){
				$(base.options.next).click(function(){
					base.$el.find('li:first').animate({
						marginTop: '-' + base.options.row_height,
			        }, base.options.speed, function() {
			            $(this).detach().css('marginTop', '0px').appendTo(base.$el);
			            base.reset_interval();
			        });
			        return false;
				});
			}
			
			//Stop on mouse hover
			if (typeof(base.options.mousestop) != "undefined" && base.options.mousestop === true) {
				base.$el.mouseenter(function(){
					base.stop_interval();
				}).mouseleave(function(){
					base.start_interval();
				});
			}
			
			/*
				TO DO List
				----------------
				Add a continuous scrolling mode
			*/
			
		}
		
		base.debug_info = function()
		{
			//Dump options into console
			console.log(base.options);
		}
		
		//Make it go!
		base.init();
  };
  
  $.omr.totemticker.defaultOptions = {
  		message		:	'Ticker Loaded',	/* Disregard */
  		next		:	null,		/* ID of next button or link */
  		previous	:	null,		/* ID of previous button or link */
  		stop		:	null,		/* ID of stop button or link */
  		start		:	null,		/* ID of start button or link */
  		row_height	:	'100px',	/* Height of each ticker row in PX. Should be uniform. */
  		speed		:	800,		/* Speed of transition animation in milliseconds */
  		interval	:	4000,		/* Time between change in milliseconds */
		max_items	: 	null, 		/* Integer for how many items to display at once. Resizes height accordingly (OPTIONAL) */
  };
  
  $.fn.totemticker = function( options ){
    return this.each(function(){
    	(new $.omr.totemticker(this, options));
  	});
  };
  
})( jQuery );

// BACKSTRETCH.JS 
// VERSION: 2.0.4
// COPYRIGHT: SCOTT ROBBIN 2013
// RELEASED UNDER THE MIT LICENSE

(function (a, d, p) {
	"use strict";
    a.fn.backstretch = function (c, b) {
        (c === p || 0 === c.length) && a.error("No images were supplied for Backstretch");
        0 === a(d).scrollTop() && d.scrollTo(0, 0);
        return this.each(function () {
            var d = a(this),
                g = d.data("backstretch");
            if (g) {
                if ("string" == typeof c && "function" == typeof g[c]) {
                    g[c](b);
                    return
                }
                b = a.extend(g.options, b);
                g.destroy(!0)
            }
            g = new q(this, c, b);
            d.data("backstretch", g)
        })
    };
    a.backstretch = function (c, b) {
        return a("body").backstretch(c, b).data("backstretch")
    };
    a.expr[":"].backstretch = function (c) {
        return a(c).data("backstretch") !== p
    };
    a.fn.backstretch.defaults = {
        centeredX: !0,
        centeredY: !0,
        duration: 5E3,
        fade: 0
    };
    var r = {
        left: 0,
        top: 0,
        overflow: "hidden",
        margin: 0,
        padding: 0,
        height: "100%",
        width: "100%",
        zIndex: -999999
    }, s = {
            position: "absolute",
            display: "none",
            margin: 0,
            padding: 0,
            border: "none",
            width: "auto",
            height: "auto",
            maxHeight: "none",
            maxWidth: "none",
            zIndex: -999999
        }, q = function (c, b, e) {
            this.options = a.extend({}, a.fn.backstretch.defaults, e || {});
            this.images = a.isArray(b) ? b : [b];
            a.each(this.images, function () {
                a("<img />")[0].src = this
            });
            this.isBody = c === document.body;
            this.$container = a(c);
            this.$root = this.isBody ? l ? a(d) : a(document) : this.$container;
            c = this.$container.children(".backstretch").first();
            this.$wrap = c.length ? c : a('<div class="backstretch"></div>').css(r).appendTo(this.$container);
            this.isBody || (c = this.$container.css("position"), b = this.$container.css("zIndex"), this.$container.css({
                position: "static" === c ? "relative" : c,
                zIndex: "auto" === b ? 0 : b,
                background: "none"
            }), this.$wrap.css({
                zIndex: -999998
            }));
            this.$wrap.css({
                position: this.isBody && l ? "fixed" : "absolute"
            });
            this.index = 0;
            this.show(this.index);
            a(d).on("resize.backstretch", a.proxy(this.resize, this)).on("orientationchange.backstretch", a.proxy(function () {
                this.isBody && 0 === d.pageYOffset && (d.scrollTo(0, 1), this.resize())
            }, this))
        };
    q.prototype = {
        resize: function () {
            try {
                var a = {
                    left: 0,
                    top: 0
                }, b = this.isBody ? this.$root.width() : this.$root.innerWidth(),
                    e = b,
                    g = this.isBody ? d.innerHeight ? d.innerHeight : this.$root.height() : this.$root.innerHeight(),
                    j = e / this.$img.data("ratio"),
                    f;
                j >= g ? (f = (j - g) / 2, this.options.centeredY && (a.top = "-" + f + "px")) : (j = g, e = j * this.$img.data("ratio"), f = (e - b) / 2, this.options.centeredX && (a.left = "-" + f + "px"));
                this.$wrap.css({
                    width: b,
                    height: g
                }).find("img:not(.deleteable)").css({
                    width: e,
                    height: j
                }).css(a)
            } catch (h) {}
            return this
        },
        show: function (c) {
            if (!(Math.abs(c) > this.images.length - 1)) {
                var b = this,
                    e = b.$wrap.find("img").addClass("deleteable"),
                    d = {
                        relatedTarget: b.$container[0]
                    };
                b.$container.trigger(a.Event("backstretch.before", d), [b, c]);
                this.index = c;
                clearInterval(b.interval);
                b.$img = a("<img />").css(s).bind("load", function (f) {
                    var h = this.width || a(f.target).width();
                    f = this.height || a(f.target).height();
                    a(this).data("ratio", h / f);
                    a(this).fadeIn(b.options.speed || b.options.fade, function () {
                        e.remove();
                        b.paused || b.cycle();
                        a(["after", "show"]).each(function () {
                            b.$container.trigger(a.Event("backstretch." + this, d), [b, c])
                        })
                    });
                    b.resize()
                }).appendTo(b.$wrap);
                b.$img.attr("src", b.images[c]);
                return b
            }
        },
        next: function () {
            return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0)
        },
        prev: function () {
            return this.show(0 === this.index ? this.images.length - 1 : this.index - 1)
        },
        pause: function () {
            this.paused = !0;
            return this
        },
        resume: function () {
            this.paused = !1;
            this.next();
            return this
        },
        cycle: function () {
            1 < this.images.length && (clearInterval(this.interval), this.interval = setInterval(a.proxy(function () {
                this.paused || this.next()
            }, this), this.options.duration));
            return this
        },
        destroy: function (c) {
            a(d).off("resize.backstretch orientationchange.backstretch");
            clearInterval(this.interval);
            c || this.$wrap.remove();
            this.$container.removeData("backstretch")
        }
    };
    var l, f = navigator.userAgent,
        m = navigator.platform,
        e = f.match(/AppleWebKit\/([0-9]+)/),
        e = !! e && e[1],
        h = f.match(/Fennec\/([0-9]+)/),
        h = !! h && h[1],
        n = f.match(/Opera Mobi\/([0-9]+)/),
        t = !! n && n[1],
        k = f.match(/MSIE ([0-9]+)/),
        k = !! k && k[1];
    l = !((-1 < m.indexOf("iPhone") || -1 < m.indexOf("iPad") || -1 < m.indexOf("iPod")) && e && 534 > e || d.operamini && "[object OperaMini]" === {}.toString.call(d.operamini) || n && 7458 > t || -1 < f.indexOf("Android") && e && 533 > e || h && 6 > h || "palmGetResource" in d && e && 534 > e || -1 < f.indexOf("MeeGo") && -1 < f.indexOf("NokiaBrowser/8.5.0") || k && 6 >= k)
})(jQuery, window);
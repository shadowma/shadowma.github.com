(function($){
	// Open external links in new window
	var externalLinks = function(){
		var host = location.host;

		$('body').on('click', 'a', function(e){
			var href = this.href,
				link = href.replace(/https?:\/\/([^\/]+)(.*)/, '$1');

			if (link != '' && link != host && !$(this).hasClass('fancybox') && !$(this).hasClass('share-link')){
				window.open(href);
				e.preventDefault();
			}
		});
	};

	// Append caption after pictures
	var appendCaption = function(){
		$('.entry-content').each(function(i){
			var _i = i;
			$(this).find('img').each(function(){
				var alt = this.alt;

				if (alt != ''){
					$(this).after('<span class="caption">'+alt+'</span>');
				}

				$(this).wrap('<a href="'+this.src+'" title="'+alt+'" class="fancybox" rel="gallery'+_i+'" />');
			});
		});
	};
	
	//scrolltotop
	$.extend(
	    $.easing, {
		easeInOutExpo: function (a, c, d, b, e) {
		    if (c == 0) return d;
		    if (c == e) return d + b;
		    if ((c /= e / 2) < 1) return b / 2 * Math.pow(2, 10 * (c - 1)) + d;
		    return b / 2 * (-Math.pow(2, - 10 * --c) + 2) + d
		}
	});

	var scrolltotop = {
	    setting: {
		startline: 150,
		scrollto: 0,
		scrollduration: 600,
		fadeduration: [500, 100]
	    },
	    controlHTML: '<a href="#top" class="top_stick">&nbsp;</a>',
	    anchorkeyword: '#top',
	    state: {
		isvisible: false,
		shouldvisible: false
	    },
	    scrollup: function() {
		var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto: parseInt(this.setting.scrollto);
		if (typeof dest == "string" && jQuery('#' + dest).length == 1) {
		    dest = jQuery('#' + dest).offset().top
		} else {
		    dest = this.setting.scrollto
		};
		this.$body.animate({
		    scrollTop: dest
		},{
		    duration: this.setting.scrollduration,
		    queue: !1,
		    easing: "easeInOutExpo"
		})
	    },
	    togglecontrol: function() {
		var $window = jQuery(window);
		var scrolltop = $window.scrollTop();
		this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true: false;
		if (this.state.shouldvisible && !this.state.isvisible) {
		    this.$control.stop().animate({
			opacity: 1
		    },
		    this.setting.fadeduration[0]);
		    this.state.isvisible = true
		} else if (this.state.shouldvisible == false && this.state.isvisible) {
		    this.$control.stop().animate({
			opacity: 0
		    },
		    this.setting.fadeduration[1]);
		    this.state.isvisible = false
		};
		var offsetx = parseInt($("#content").width() * 0.8) + 60;
		var offsety = parseInt($window.height() * 0.15);
		this.$control.css({
		    'margin-left': (offsetx > 750)? 750 : offsetx,
		    display: (offsetx < 420)? 'none' : 'block',
		    bottom: offsety
		});
	    },
	    init: function() {
		jQuery(document).ready(function($) {
		    var mainobj = scrolltotop;
		    mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		    mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>').css({
			position: 'fixed',
			opacity: 0,
			cursor: 'pointer',
		    }).attr({
			title: '返回頂部'
		    }).mouseover(function(){
			up();
		    }).mouseout(function(){
			clearTimeout(fq);
		    }).click(function() {
			mainobj.scrollup();
			return false
		    }).appendTo('#content');
		    mainobj.togglecontrol();
		    $('a[href="' + mainobj.anchorkeyword + '"]').click(function() {
			mainobj.scrollup();
			return false
		    });
		    $(window).bind('scroll resize',
		    function(e) {
			mainobj.togglecontrol()
		    });
		})
	    }
	};
	
	var Footnotes = {
	    footnotetimeout: false,
	    iOS: function() {
		    var agent = navigator.userAgent.toLowerCase();
		    return (
			    agent.indexOf('iphone') >= 0
		    ||
			    agent.indexOf('ipad') >= 0
		    ||
			    agent.indexOf('ipod') >= 0
		    );
	    },
	    setup: function() {
		    var footnotelinks = jQuery("a[rel='footnote']")
		
		    footnotelinks.unbind('mouseover',Footnotes.footnoteover);
		    footnotelinks.unbind('mouseout',Footnotes.footnoteoout);
		
		    footnotelinks.bind('mouseover',Footnotes.footnoteover);
		    footnotelinks.bind('mouseout',Footnotes.footnoteoout);
	    },
	    footnoteover: function() {
		    clearTimeout(Footnotes.footnotetimeout);
		    jQuery('#footnotediv').stop();
		    jQuery('#footnotediv').remove();
		
		    var id = jQuery(this).attr('href').substr(1);
		    var position = jQuery(this).offset();
	
		    var d = document.createElement('div');
		    var div = jQuery(d);
		    div.attr('id','footnotediv');
		
		    if(Footnotes.iOS()) {
			    // don't bind the mouseover event here; otherwise, Safari for iOS
			    // will only trigger the mouseover event when the user taps the
			    // popup, and will not fire the remaining events
			    // see here: http://developer.apple.com/library/ios/#DOCUMENTATION/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
			    div.bind('click',Footnotes.remove);
		    } else {
			    div.bind('mouseover',Footnotes.divover);
			    div.bind('mouseout',Footnotes.footnoteoout);
		    }

		    var el = document.getElementById(id);
		    div.html('<div>'+jQuery(el).html()+'</div>');
		    div.find("a[rel='reference']").remove();
		
		    jQuery(document.body).append(div);

		    var left = position.left;
		    if(left + 420  > jQuery(window).width() + jQuery(window).scrollLeft())
			    left = jQuery(window).width() - 420 + jQuery(window).scrollLeft();
		    var top = position.top+20;
		    if(top + div.height() > jQuery(window).height() + jQuery(window).scrollTop())
			    top = position.top - div.height() - 15;
		    div.css({
			    left:left,
			    top:top,
		    });
	    },
	    footnoteoout: function() {
		    Footnotes.footnotetimeout = setTimeout(function() {
			    Footnotes.remove();
		    },100);
	    },
	    remove: function() {
		    jQuery('#footnotediv').animate({
			    opacity: 0
		    }, 600, function() {
			    jQuery('#footnotediv').remove();
		    });
	    },
	    divover: function() {
		    clearTimeout(Footnotes.footnotetimeout);
		    jQuery('#footnotediv').stop();
		    jQuery('#footnotediv').css({
				    opacity: 1
		    });
	    }
	}
	
	scrolltotop.init();
	externalLinks(); // Delete or comment this line to disable opening external links in new window
	appendCaption(); // Delete or comment this line to disable caption
	Footnotes.setup();
})(jQuery);

var up = function(){
    $wd = jQuery(window);
    $wd.scrollTop($wd.scrollTop() - 1);
    fq = setTimeout("up()", 50);
}
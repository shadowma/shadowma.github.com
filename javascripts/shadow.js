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
	    controlattrs: {
		offsetx: parseInt($("#content").width() * 0.8) + 60,
		offsety: 80
	    },
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
		var scrolltop = jQuery(window).scrollTop();
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
		}
	    },
	    init: function() {
		jQuery(document).ready(function($) {
		    offx_new = scrolltotop.controlattrs.offsetx;
		    if (offx_new > 750) {
			offx_new = 750
		    };
		    var mainobj = scrolltotop;
		    var iebrws = document.all;
		    mainobj.controlattrs.offsetx= offx_new;
		    mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		    mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>').css({
			position: 'fixed',
			bottom: mainobj.controlattrs.offsety,
			'margin-left': mainobj.controlattrs.offsetx,
			opacity: 0,
			cursor: 'pointer',
			display: (offx_new < 420)? 'none' : 'block'
		    }).attr({
			title: '返回頂部'
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
		    })
		})
	    }
	};

	var navAjax = function() {
		jQuery(document).ready(function($) {
			jQuery('#header nav ul li a:not(.noajax)').live('click', function(e){
			    e.preventDefault();
			    var link = jQuery(this).attr('href');
			    var height = jQuery('#ajax-container').height();
			    jQuery('#content .page').css('min-height', height + 'px');
			    jQuery('#ajax-container').fadeOut(300).load(link + ' #ajax-inner', function(){ jQuery('#ajax-container').fadeIn(300); scrolltotop.init();});
		    });
		    jQuery('#header nav ul li a').click(function(){
			    jQuery('#header nav ul li a').removeClass("active_menu");
			    jQuery(this).addClass("active_menu");
		    });
		})
	};

	scrolltotop.init();
	externalLinks(); // Delete or comment this line to disable opening external links in new window
	appendCaption(); // Delete or comment this line to disable caption
	navAjax();
})(jQuery);


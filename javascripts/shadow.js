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

	externalLinks(); // Delete or comment this line to disable opening external links in new window
	appendCaption(); // Delete or comment this line to disable caption
})(jQuery);

jQuery(document).ready(function($) {
  
  	jQuery('#header nav ul li a:not(.noajax)').live('click', function(e){
		e.preventDefault();
		var link = jQuery(this).attr('href');
		var height = jQuery('#ajax-container').height();
		jQuery('#content .page').css('min-height', height + 'px');
		jQuery('#ajax-container').fadeOut(300).load(link + ' #ajax-inner', function(){ jQuery('#ajax-container').fadeIn(300); });
	});
	
	jQuery('#header nav ul li a').click(function(){ 		
		jQuery('#header nav ul li a').removeClass("active_menu");
		jQuery(this).addClass("active_menu");
	});
});

//scrolltotop
var scrolltotop = {
    setting: {
        startline: 150,
        scrollto: 0,
        scrollduration: 500,
        fadeduration: [500, 100]
    },
    controlHTML: '<a href="#top" class="top_stick">&nbsp;</a>',
    controlattrs: {
        offsetx: 20,
        offsety: 80
    },
    controlfooter: 60,
    maxwidth: 960,
    anchorkeyword: '#top',
    state: {
        isvisible: false,
        shouldvisible: false
    },
    scrollup: function() {
        if (!this.cssfixedsupport) {
            this.$control.css({
                opacity: 0
            })
        };
        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto: parseInt(this.setting.scrollto);
        if (typeof dest == "string" && jQuery('#' + dest).length == 1) {
            dest = jQuery('#' + dest).offset().top
        } else {
            dest = this.setting.scrollto
        };
        this.$body.animate({
            scrollTop: dest
        },
        this.setting.scrollduration)
    },
    resized: function() {
        var $window = jQuery(window);
        var tmpx = $window.scrollLeft() + $window.width();
        var fixx = (tmpx <= this.maxwidth) ? 0 : ((tmpx - this.maxwidth) / 2);
        var controlx = fixx + this.$control.width() + this.controlattrs.offsetx;
        var fixy = maxY - $window.scrollTop() - $window.height() - this.controlattrs.offsety - this.controlfooter;
        var controly = (fixy >= 0) ? 0 : ( - fixy);
        this.$control.css({
            bottom: controly,
            right: controlx
        })
    },
    keepfixed: function() {
        var $window = jQuery(window);
        var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx;
        var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety;
        this.$control.css({
            left: controlx + 'px',
            top: controly + 'px'
        })
    },
    togglecontrol: function() {
        var scrolltop = jQuery(window).scrollTop();
        if (!this.cssfixedsupport) {
            this.keepfixed()
        };
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
            var offx_new = 50;
            var maxY = document.body.clientWidth;
            if (maxY > 1024) {
                offx_new = parseInt((maxY - 960) / 2)
            }
            var mainobj = scrolltotop;
            var iebrws = document.all;
            mainobj.controlattrs.offsetx = offx_new - 50;
            mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest;
            mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
            mainobj.$control = $('<div id="topcontrol">' + mainobj.controlHTML + '</div>').css({
                position: mainobj.cssfixedsupport ? 'fixed': 'absolute',
                bottom: mainobj.controlattrs.offsety,
                right: mainobj.controlattrs.offsetx,
                opacity: 0,
                cursor: 'pointer'
            }).attr({
                title: '返回頂部'
            }).click(function() {
                mainobj.scrollup();
                return false
            }).appendTo('body');
            if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != '') {
                mainobj.$control.css({
                    width: mainobj.$control.width()
                })
            };
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
scrolltotop.init();
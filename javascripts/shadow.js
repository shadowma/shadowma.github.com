(function($){
	// Open external links in new window
	var externalLinks = function(){
		var host = location.host;

		$('body').on('click', 'a', function(e){
			var href = this.href,
				link = href.replace(/https?:\/\/([^\/]+)(.*)/, '$1');

			if (link != '' && link != host && !$(this).hasClass('fancybox')){
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
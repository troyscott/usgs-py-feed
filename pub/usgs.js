


(function ($) {

	console.log('jQuery is working...');

	var methods = {
    	
		initHomePage : function() {

		console.log('initHomePage');
		
		var $page = $("#main");

		// create page data that can be shared between
		// the usgs reports	
		$page.data("report", "");	
	


    },

    	initHourlyPage : function() {
   			
		console.log('initHourlyPage'); 

		var $page = $("#last_hour_m1-page")
		var $config = $("#main");				

		$page.live("pageshow", function(event, ui){
			
			$config.data("report","last_hour_m1");		
			console.log('last_hour_m1');
			getLastHourM1();					
			

			});


	},

    initOptionsPage : function() {
    

	},

    initAll : function() {
      $().initApp("initHomePage");
      $().initApp("initHourlyPage");
      $().initApp("initOptionsPage");
    }
  }

  $.fn.initApp = function(method) {
    
	// Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this,
      Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.initAll.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist' );
    }
  }




})(jQuery);


$(document).ready(function(){
	
	$().initApp();



});


var getLastHourM1 = function() {
	console.log("getLastHourM1");
	
	var $config = $("#main");
	console.log($config.data("report")); 
	var report = $config.data("report");
	var url = 'quake/' + report;
 
	$.ajax({
		url: url,
		dataType: 'json',
		success: function(data) {
			console.log('data - success');
			
			$.each(data.rss, function(index, field) {
			
			var feed = [];
			var listItemID = '#' + report + "-" + field.guid;
			var listItem = $(listItemID);
		
			console.log(field.guid);
		
			if ($('li').index(listItem) == -1)
			{	
				feed.push('<li id="' + listItemID + '" ><h3>' + field.title + '</h3>');
				feed.push('<p>' + field.date_iso_gmt ); 
				feed.push('&nbsp;' +  field.time_iso_gmt + ' GMT</p></li>');
				console.log('writing new data ...');
			}	
			
			/*		
				// If this is the initial page load then append the
				// new list item to the unordered list	
				if (isPageRefresh == false) {
			*/
					console.log('append to ul');
					$(feed.join('\n')).appendTo('#' + report);
			
			/*
				}

				// If this is a page refresh then you can't append the new
				// list item to the undordered list because the sequence will 
				// be incorrect. - Add it before the first list item

				else
				{

					console.log('insert before first item in the list');
					$('li').first().before(feed.join('\n'));
									
				}

				*/

			}); // each rss item	

		} // success
	
		}); // ajax

} 




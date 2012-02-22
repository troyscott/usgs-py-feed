
refresh_last_hour = true;


(function ($) {

	console.log('jQuery is working...');
	var methods = {
    	
		initHomePage : function() {
		console.log('initHomePage');

		$("#main").live("pageshow", function(event, ui) {
			
			console.log("page show: main");

		});

	
    },

    	initHourlyPage : function() {
   			
		console.log('initHourlyPage'); 
		var report = "last_hour_m1";

		$("#last_hour_m1-page").trigger("pageshow");			
		console.log("last hour: " + $("#last_hour_m1-page").length);	
	
		
		// Check to see if the page exist
			
			
		$("#last_hour_m1-page").live("pageshow", function(event, ui){
		
			console.log("refresh_last_hour: " + refresh_last_hour);
			console.log("event: pageshow:" + report + "-page");
			var $page = $("#" + report + "-page");
			$page.data("report", report);
			
			if ( refresh_last_hour) 
			{
				refresh_last_hour = false;
				getLastHourM1();	

			}
				
		});


		$("#last_hour_m1-page").live("pagehide", function(event, ui) {
		
			console.log("event: page hide: " + report + "-page");
			$("ul").children().remove();


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

i = 0
var getLastHourM1 = function() {
	
	console.log("function: getLastHourM1");

	var $page = $("#last_hour_m1-page");
	var report = $page.data("report");
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
		
			if ($('li').index(listItem) == -1)
			{	
				feed.push('<li id="' + listItemID + '" ><h3>' + field.title + '</h3>');
				feed.push('<p>' + field.date_iso_gmt ); 
				feed.push('&nbsp;' +  field.time_iso_gmt + ' GMT</p></li>');
				console.log('writing new data ...');
			}	
		
			$list = $("#" + report);

			$items = $(feed.join('\n'));
			$items.appendTo($list);	
			

			}); // each rss item	

		}, // success
		complete : function() {
			$("#" + report ).listview("refresh");
			
		}
			
		}); // ajax

	

	setTimeout(function() {
		console.log("Set time out...");
		$("ul").children().remove();
		getLastHourM1()
		
	},10000);	
	

} 




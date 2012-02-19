

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

			

		$("#last_hour_m1-page").live("pageshow", function(event, ui){
		

			console.log("page show:" + report + "-page");
			var $page = $("#" + report + "-page");
			$page.data("isRefresh", false);
			$page.data("report", report);
			console.log($page.data("report"));
			//getLastHourM1();
			
			getLastHourM1();	
		
			console.log("Refresh ..");
			$page.data("isRefresh", true);
				
		});

		$("#last_hour_m1-page").live("pagehide", function(event, ui) {
		
			console.log("page hide: " + report + "-page");
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


var getLastHourM1 = function() {
	
	console.log("getLastHourM1");

	var $page = $("#last_hour_m1-page");
	var report = $page.data("report");
	var url = 'quake/' + report;

	console.log($page.data("isRefresh"));

 
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
		$page.trigger("pageshow");

	},10000);	

} 




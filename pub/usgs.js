


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




refresh_last_hour = true;


var getLastHourM1 = function() {
	
	console.log("function: getLastHourM1");

	var $page = $("#last_hour_m1-page");
	var report = $page.data("report");
	var url = 'quake/' + report;
	var refreshRate = 10000

	// prevent Internal 500 Server Error
	if (typeof report == "undefined")
	{
		console.log("url is not defined ...");
		refresh_last_hour = true;
		return;

	}
	// process ajax request
	else

	{


	// replaced success, error and complete with
	// done, fail and alwyas
	// success, eror  adn complete will be deprecated
	// in jQuery 1.8

	console.log("Process ajax call ...");

	var jqxhr = $.ajax({url: url, dataType: 'json'})
	
	.done(function(data) {
		
			console.log(data);	
			$.each(data.rss, function(index, field) {
			
			var feed = [];
			// create unique list id
			var listItemID =  report + "-" + field.guid;
	
			console.log(listItemID);
			var listItem = $("#" + listItemID);
		
			console.log($('li').index(listItem));	
			
			//check to see if the id already exists in the list
			if ($('li').index(listItem) == -1)
			{	
				// if it exits add it to the array (push it)
				feed.push('<li id="' + listItemID + '" ><a href="map.html">');
				feed.push('<h3>' + field.title + '</h3>');
				feed.push('<p>' + field.date_iso_gmt ); 
				feed.push('&nbsp;' +  field.time_iso_gmt + ' GMT</p></a></li>');
				console.log('writing new data ...');
			}	

			// prepend the data, if any, to the unordered list
			$list = $("#" + report);
			
			$items = $(feed.join('\n'));
			console.log($items);
			$items.prependTo($list).hide();
			$items.fadeIn(2000);


   
			}); // each rss item	

    		this.t = function() {	
				window.setTimeout(function() {
				console.log("Set time out...");
				//$("ul").children().remove();
				getLastHourM1();	
			}, refreshRate);	
	
			}

			this.t();


	}) // done

	.fail(function(jqXHR, textStatus, e) {

			console.log("Text Status: " + textStatus);
			refresh_last_hour = true
			
			return;

	}) // fail

	.always(function() {
			$("#" + report ).listview("refresh");
			
	}); // always
			
	
	} // end if

} 



var getPastSevenDaysM5 = function() {

	console.log("getPastSevenDaysM5");



}



var getPastSevenDaysM7 = function() {

	console.log("getPastSevenDaysM7");



}


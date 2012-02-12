
(function($){

        console.log('jQuery Works');
		// bind the page create event to the hourly m0+ ajax request

		reports = ['last_hour_m1', 'past_day_m25', 'past_7_days_m5', 'past_7_days_m7']		
		
		$.each(reports, function(index, report){ 
			console.log(report);
		
		$('#'+ report + '-page').bind('pageinit', function() {
			console.log('pageinit....');	
			var url = 'quake/' + report;
			console.log(url);
        	$.ajax({	
				url: url, 
				dataType:  'json',
				success: function(data) {		
                	var feed = []
					$.each(data.rss, function(index, field) {
                		feed.push('<li><h3>' + field.title + '</h3></li>');

                	});
                	jQuery(feed.join('\n')).appendTo('#' + report);
				},
			
				complete: function(){

					$('#' + report).listview('refresh');
				}	

        	}); // ajax call

			}); // pageinit
		
		}); // for each report

})(jQuery);



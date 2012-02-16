
(function($){

        console.log('jQuery Works');
		// bind the page create event to the hourly m0+ ajax request

		reports = ['last_hour_m1', 'past_day_m25', 'past_7_days_m5', 'past_7_days_m7']		
		
		$.each(reports, function(index, report){ 
			console.log(report);
		
		var isPageRefresh = false;

		$('#'+ report + '-page').bind('pageinit', function() {
		
			console.log('pageinit....');	
		
			var url = 'quake/' + report;
        	
			console.log('pageinit: ' + url);	
		
			$.ajax({	
				url: url,
				cach: true, 
				dataType:  'json',
				success: function(data) {		
							
					$.each(data.rss, function(index, field) {
       					
						var feed = [];
						var listItem = $('#' + field.guid);
         		
						console.log($('li').index(listItem));


						// light grey
						//rowColor = '#f4f2e6';
						
						// light yellow
						var rowColor = '#fbfcb8'; 

						
						// If the guid does not exist in the list
						// then create the new list item
						if ($('li').index(listItem) == -1)
						{	
							feed.push('<li id="' + field.guid + '" ><h3>' + field.title + '</h3>');
							feed.push('<p>' + field.date_iso_gmt ); 
							feed.push('&nbsp;' +  field.time_iso_gmt + ' GMT</p></li>');
							console.log('writing new data ...');
					
							// If this is the initial page load then append the
							// new list item to the unordered list	
							if (isPageRefresh == false) {
									console.log('append to ul');
									$(feed.join('\n')).appendTo('#' + report);
	
							}

							// If this is a page refresh then you can't append the new
							// list item to the undordered list because the sequence will 
							// be incorrect. - Add it before the first list item

							else
							{

									console.log('insert before first item in the list');
									$('li').first().before(feed.join('\n'));
									// highlight the latest records 
									$('li').first().css('color', rowColor);
	
							}

						}

							console.log('isPageRefresh: ' + isPageRefresh);	

                	});
                	//jQuery(feed.join('\n')).appendTo('#' + report);
				},
			
				complete: function(){

					$('#' + report).listview('refresh');
				}	

        	}); // ajax call

				// refresh the data every 15 seconds
				setTimeout(function(){
					$('#' + report + '-page').trigger('pageinit');
					// This is required to load the data correctly for 
					// the undordered list
					isPageRefresh = true;						
				}, 15000);

			}); // pageinit
		
		}); // for each report

})(jQuery);


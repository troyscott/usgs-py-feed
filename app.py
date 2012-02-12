#!/usr/bin/env python
#
#	Developed by: Troy Scott	
#	Created: January 21, 2012		
#	Modified: February  11, 2012
#	
#	Description:
#
#	This module is used to handle RESTful requests to the 
#	USGS api and provide a simple web server front end for
#	the application.


import geofeed
import datetime
import sys
import os


from bottle import route, run, error, debug
from bottle import get, post, request, response
from bottle import static_file


htdocs = '%s/pub' % os.getcwd()


@route('/')
def get_home():
	filename = 'index.html'
	print os.getcwd()
	return static_file(filename, root=htdocs)


@route('/<filename>')
def server_static(filename):
	return static_file(filename, root=htdocs)


@route('/quake/<rss>')
def get_quake(rss):

	print rss.upper()

		
	if rss.upper() == 'LAST_HOUR_M1':
		url = geofeed.LAST_HOUR_M1
	if rss.upper() == 'PAST_DAY_M25':
		url = geofeed.PAST_DAY_M25
	if rss.upper() == 'PAST_7_DAYS_M5':
		url = geofeed.PAST_7_DAYS_M5
	if rss.upper() == 'PAST_7_DAYS_M7':
		url = geofeed.PAST_7_DAYS_M7

	response.content_type = 'application/json'	

	return geofeed.get_raw_feed(url) 

  
def main():
	debug(False)
	run(host='0.0.0.0', port=8080, reloader=True)

# Start the server
if __name__ == '__main__':
	main()

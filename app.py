#!/usr/bin/env python
#
#		Developed by: Troy Scott	
#		Created: January 21, 2012		
#		Modified: February  11, 2012
#	
#		Description:
#
#		This module is used to handle RESTful requests to the 
#		USGS api and provide a simple web server front end for
#		the application.
#
#       GNU General Public License, version 2 (GPL-2.0)
#		-----------------------------------------------
#
#       This program is free software; you can redistribute it and/or modify it under the terms 
#       of the GNU General Public License as published by the Free Software Foundation; either 
#       version 2 of the License, or (at your option) any later version.
#
#       This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
#       without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
#       See the GNU General Public License for more details.
#
#       You should have received a copy of the GNU General Public License along with this program; 
#       if not, write to the Free Software Foundation, Inc., 59 
#       Temple Place, Suite 330, Boston, MA 02111-1307 USA





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

	ip = request.environ.get('REMOTE_ADDR')
	print 'Feed: %s - %s - %s' % (rss.upper(),ip, datetime.datetime.now()) 

		
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

  
def main(server_port) :
	debug(False)
	run(server='tornado', host='0.0.0.0', port=server_port, reloader=True)

# Start the server
if __name__ == '__main__':
	import sys
	
	if len(sys.argv) == 1:
		print 'Please enter the port for the server'
	else:
		#print 'Sever is running on port: %s' % sys.argv([1])
		main(int(sys.argv[1]))












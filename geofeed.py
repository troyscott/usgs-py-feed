#!/usr/bin/env python
#	
#	Developed by: 	Troy Scott
#	Created: January 21, 2012
#	Modified: February  8, 2012
#
#	Description:
#
# 	This is the USGS API Module.  It makes calls to the external
# 	USGS data feeds (usually rss feeds) and converts them to 
# 	XML and JSON.

from datetime import date, time

import httplib2
from  xml.etree import ElementTree
import simplejson as json
import types

import re
import os
import sys
import ast

# Report Constants

LAST_HOUR_M0 = "http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M0.xml"
LAST_HOUR_M1 = "http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M1.xml"


def get_xml(url):
	client = httplib2.Http()
	response, xml = client.request(url, "GET")
	doc = ElementTree.fromstring(xml)
	
	return doc

# If Python Bottle Framework is passed a Dictionary
# it automatically converts it to a JSON string	
def rss_to__dict(doc):
	
	# Create a Dictionary to store the data  
	# from the rss feed (xml)
	rss = {"rss":[]}
	for feed in doc.findall("channel/item"):
		# Create a Dictionary for the current item
		data = {}
		for item in feed:
			for k,v  in transform(item.tag,item.text).iteritems():
				data[k] = v				
		rss["rss"].append(data)
	
	return rss


# Strip the uri from the XML Namespace if it exists
# For example,  {http://www.w3.org/2003/01/geo/wgs84_pos#}lat:
# would become jus "lat"
def remove_uri(name):
	if name[0] == "{":
		tag  = name[1:].split("}")[1]
		return tag 
	else:
		return name


# Returns the raw data from the xml file
# No transformaiton have been performend at 
# this point (Extract)			
def get_raw_feed(url=LAST_HOUR_M1):
	return rss_to__dict(get_xml(url))

 
def transform(tag, value):


	'''
	new quake dictionary spec:
	
	guid: "nc71720285" - No change
	title: "M 1.2, Northern California" - no change
	magnitude: "1.2" - derived from title
	long: "-122.8043"
	lat: "38.8250"
	subject: "2.9 km"
	

	'''
 	tag = remove_uri(tag)
	items = {}

	items[tag] = value

	# Create ISO Date (YYYY-MM-DD) and ISO Time (hh:mm:ss) from
	# the pubDate	
	if tag == "pubDate":
		(day, month, year) = ('','','')
		(hour, minute, seconds) = ('','','')
		p = re.compile(r"\w\w\w,\s(?P<day>\d\d)\s(?P<month>\w\w\w)\s(?P<year>\d\d\d\d)" \
						"\s(?P<time>\d\d:\d\d:\d\d)")		
		m = p.match(value)
		if m:
			# Convert string to date
			iso_date = date(
				int(m.groupdict()['year']), 
				getMonthNumber(m.groupdict()['month']), 
				int(m.groupdict()['day']) 
			)
		
			t = m.groupdict()['time'].split(':')
			iso_time = time (int(t[0]), int(t[1]), int(t[2]) )
			
			print 'iso date: %s' % (iso_date)
			print 'iso time: %s' % (iso_time)
			items['date_iso_gmt'] = iso_date.isoformat()
			items['time_iso_gmt'] = iso_time.isoformat()
		else:
			print 'RegExp match failed for pubDate'
	 	
		

	return items  

def getMonthNumber(month):

	num = {
			'Jan': 1, 'Feb': 2, 'Mar': 3, 
			'Apr': 4, 'May': 4, 'Jun': 6,
			'Jul': 7, 'Aug': 8, 'Sep': 9,
			'Oct': 10, 'Nov':	11, 'Dec': 12 }

	return num[month]



if __name__ == '__main__':
	pass

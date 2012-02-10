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

import datetime
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

 
def transform(tagname, tagvalue):

	# Convert this to a class to make it more
	# flexible.

	'''
	new quake dictionary spec:
	
	guid: "nc71720285" - No change
	description: "January 29, 2012 06:31:13 GMT" - omit
	title: "M 1.2, Northern California" - no change
	date_long: "January 29, 2012" - derived from description
	date_short: "2012/01/29" - derived from description
	time_gmt: "06:31:13 GMT' - derived from description
	magnitude: "1.2" - derived from title
	long: "-122.8043"
	lat: "38.8250"
	subject: "2.9 km"
	

	'''
 	tag = remove_uri(tagname)
	value = tagvalue	 

	items = {}

	if tag == "description":
		items['date_short'] = '2012/02/01'
		items['date_long'] = 'February 01, 2012'
	else:
		items[tag] = value
		

	return items  

def run():
	pass

if __name__ == '__main__':
	print 'geofeed.run()'
	run()


#!/usr/bin/env python
#	
#	Developed by: 	Troy Scott
#	Created: January 21, 2012
#	Modified: January 23, 2012
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



def getFeed(url):
	client = httplib2.Http()
	response, xml = client.request(url, "GET")
	doc = ElementTree.fromstring(xml)
	
	return doc
# If Python Bottle Framework is passed a Dictionary
# it automatically converts it to a JSON Object	
def rss_to__dict(doc):
	
	# Create a Dictionary to store the data  
	# from the rss feed (xml)
	rss = {"rss":[]}
	for feed in doc.findall("channel/item"):
		# Create a Dictionary for the current item
		item = {}
		for items in feed:
			item[items.tag] = items.text
		rss["rss"].append(item)
	
	return rss



def quakeFeed2(url):
	return rss_to_json(getFeed(url))
			
def quakeFeed(url=LAST_HOUR_M1):
	return rss_to__dict(getFeed(url))


if __name__ == '__main__':
	print 'geofeed.run()'
	run()


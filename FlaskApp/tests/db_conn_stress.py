import urllib, urllib2
import time
from ..models import *
from random import random

BASE = "http://ntowbinj.com/blog"
HDR = {'User-Agent': 'flimpflumpagus'}

def hit():
    posts = Post.select(Post.date)
    dates = [post.date for post in posts]
    choice = dates[int(random()*len(dates))]
    url = "{}/{}".format(BASE, choice)
    print(url)
    req = urllib2.Request(url, headers=HDR)
    response = urllib2.urlopen(req)
    print(response.getcode())




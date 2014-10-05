import urllib, urllib2
import time
from ..models import *
from random import random

BASE = "http://ntowbinj.com"
HDR = {'User-Agent': 'flimpflumpagus'}

def hit_blog():
    posts = Post.select(Post.date)
    dates = [post.date for post in posts]
    choice = dates[int(random()*len(dates))]
    url = "{}/blog/{}".format(BASE, choice)
    print(url)
    req = urllib2.Request(url, headers=HDR)
    response = urllib2.urlopen(req)
    print(response.getcode())


def hit_tag():
    tags = Tag.select(Tag.name)
    names = [tag.name for tag in tags]
    choice = names[int(random()*len(names))]
    url = "{}/blog/tag/{}".format(BASE, choice)
    print(url)
    req = urllib2.Request(url, headers=HDR)
    response = urllib2.urlopen(req)
    print(response.getcode())





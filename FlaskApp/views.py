from . import app

from flask import render_template, jsonify, request, abort
from flask import redirect
from flask import send_from_directory, url_for, session
from hashlib import md5

import shortestpath
import musichelp
import os

from jinja2 import TemplateNotFound

@app.route("/analytics")
def soon():
    return render_template('soon.html', hide_nav=True)

@app.route("/blog/")
def nullblog():
    return blog("9-7-14")

@app.route("/blog/<post>")
def blog(post):
    try:
        return render_template('/blogs/%s.html' % (post))
    except TemplateNotFound:
        abort(404)

@app.route("/")
def default():
    return synonym()

@app.route("/synonyms")
def synonym():
    return render_template('syn.html')

@app.route("/multicolumn")
def multicolumn():
    return render_template('multicolumn.html')

@app.route("/foliage")
def foliage():
    return music(hide_nav=True)

@app.route("/music")
def music(hide_nav=None):
    return render_template('music.html', hide_nav=hide_nav)

@app.route("/getpath", methods = ['POST'])
def getpath():
    path = shortestpath.shortest_path(request.form);
    return path 

@app.route("/eartrainer")
def eartrainer(): 
    return render_template('home.html', intervs = musichelp.INTERVALS) 

@app.route("/wordlist.txt")
def wordlist():
    return send_from_directory('/usr/share/dict', "words")

@app.route("/synonyms/strongly_connected.txt")
def strongly():
    here = os.path.dirname(__file__)
    return send_from_directory(os.path.join(here, "static/files/"), "strongly_connected.txt")


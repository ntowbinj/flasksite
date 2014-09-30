from . import main

from flask import render_template, jsonify, request, abort
from flask import redirect
from flask import send_from_directory, url_for 
from flask import current_app
from hashlib import md5

import shortestpath
import musichelp
import os

@main.route("/analytics")
def soon():
    return render_template('soon.html', hide_nav=True)

@main.route("/")
def default():
    return synonym()

@main.route("/synonyms")
def synonym():
    return render_template('syn.html')

@main.route("/multicolumn")
def multicolumn():
    return render_template('multicolumn.html')

@main.route("/foliage")
def foliage():
    return music(hide_nav=True)

@main.route("/music")
def music(hide_nav=None):
    return render_template('music.html', hide_nav=hide_nav)

@main.route("/getpath", methods = ['POST'])
def getpath():
    path = shortestpath.shortest_path(request.form);
    return path 

@main.route("/eartrainer")
def eartrainer(): 
    return render_template('home.html', intervs = musichelp.INTERVALS) 

@main.route("/wordlist.txt")
def wordlist():
    return send_from_directory('/usr/share/dict', "words")

@main.route("/synonyms/strongly_connected.txt")
def strongly():
    here = os.path.dirname(__file__)
    print("here")
    return send_from_directory(os.path.join(here, "../static/files/"), "strongly_connected.txt")


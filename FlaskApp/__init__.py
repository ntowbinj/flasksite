from flask import Flask, render_template, jsonify, request, abort, send_from_directory
import shortestpath
import urllib2, urllib, httplib
import musichelp
import os
from jinja2 import TemplateNotFound

app = Flask(__name__)

@app.route("/analytics")
def soon():
    return render_template('soon.html', hide_nav=True)

@app.route("/blog/")
def nullblog():
    return blog("9-7-14")

@app.route("/blog/<post>")
def blog(post):
    scripts = ['js/visuals.js', 'js/blog.js', 'js/prettify.js']
    try:
        return render_template('/blogs/%s.html' % (post), scripts=scripts)
    except TemplateNotFound:
        abort(404)

@app.route("/")
@app.route("/synonymgraph")
@app.route("/synonyms")
def synonym():
    scripts = ['js/visuals.js', 'js/synonyms.js']
    return render_template('syn.html', scripts = scripts)

@app.route("/multicolumn")
def multicolumn():
    return render_template('multicolumn.html')

@app.route("/foliage")
def foliage():
    return music(hide_nav=True)

@app.route("/music")
def music(hide_nav=None):
    scripts = ['js/visuals.js', 'js/music.js']
    return render_template('music.html', scripts = scripts, hide_nav=hide_nav)

@app.route("/getpath", methods = ['POST'])
def getpath():
    path = shortestpath.shortest_path(request.form);
    return path 

@app.route("/eartrainer")
def eartrainer(): 
    scripts = ['AudioDetect.js', 'LoadPlugin.js', 'Plugin.js', 'Player.js'] 
    scripts = ['js/MIDI.js/js/MIDI/' + d for d in scripts]
    scripts.append('js/MIDI.js/js/Window/DOMLoader.XMLHttp.js')
    scripts.append('js/MIDI.js/js/Widgets/Loader.js')
    scripts.append('js/MIDI.js/inc/Base64.js')
    scripts.append('js/MIDI.js/inc/base64binary.js')
    scripts.append('js/slimmed.js')
    scripts.extend(['js/visuals.js'])
    return render_template('home.html', scripts=scripts, intervs = musichelp.INTERVALS) 

@app.route("/wordlist.txt")
def wordlist():
    return send_from_directory('/usr/share/dict', "words")

@app.route("/synonyms/strongly_connected.txt")
def strongly():
    here = os.path.dirname(__file__)
    return send_from_directory(os.path.join(here, "static/files/"), "strongly_connected.txt")



if __name__ == "__main__":
    app.run(debug=True)

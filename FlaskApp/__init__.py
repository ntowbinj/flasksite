from flask import Flask, render_template, jsonify, request
import shortestpath
import urllib2, urllib, httplib
import musichelp
app = Flask(__name__)
print(__name__)

@app.route("/")
@app.route("/eartrainer")
def hello(): 
    dependencies = ['AudioDetect.js', 'LoadPlugin.js', 'Plugin.js', 'Player.js'] 
    dependencies = ['js/MIDI.js/js/MIDI/' + d for d in dependencies]
    dependencies.append('js/MIDI.js/js/Window/DOMLoader.XMLHttp.js')
    dependencies.append('js/MIDI.js/js/Widgets/Loader.js')
    dependencies.append('js/MIDI.js/inc/Base64.js')
    dependencies.append('js/MIDI.js/inc/base64binary.js')
    dependencies.append('js/slimmed.js')
    dependencies.extend(['js/visuals.js'])
    onloads = ['midiSetup']
    return render_template('home.html', onloads=onloads, dependencies=dependencies, intervs = musichelp.INTERVALS) 

@app.route("/synonymgraph")
@app.route("/synonyms")
def synonym():
    dependencies = ['js/visuals.js', 'js/synonyms.js']
    onloads = ['synonymSetup']
    return render_template('syn.html', onloads=onloads, dependencies = dependencies)

@app.route("/music")
def music():
    dependencies = ['js/visuals.js', 'js/music.js']
    onloads = ['musicSetup']
    return render_template('music.html', onloads=onloads, dependencies = dependencies)

@app.route("/getpath", methods = ['POST'])
def getpath():
    print("HELLO")
    path = shortestpath.shortest_path(request.form);
    return path 

@app.route("/red")
def first_resutl():
    hdr = [('User-Agent','flimpflumpagus')]
    opener = urllib2.build_opener()
    opener.addheaders = hdr
    page = RedditPage('all', opener)
    page.gather_posts()
    for title in page.soup.find_all('a', attrs={'class' : 'title'}):
        title['href'] = 'floont'
    title.string = 'hello'
    return page.soup.prettify()
  #return page.posts[0].title 


if __name__ == "__main__":
    app.run(debug=True)

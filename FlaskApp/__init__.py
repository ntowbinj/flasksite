from flask import Flask, render_template, jsonify, request
import shortestpath
import urllib2, urllib, httplib
import musichelp
app = Flask(__name__)
print(__name__)

@app.route("/eartrainer")
def hello(): 
    static = ['AudioDetect.js', 'LoadPlugin.js', 'Plugin.js', 'Player.js'] 
    static = ['js/MIDI.js/js/MIDI/' + d for d in static]
    static.append('js/MIDI.js/js/Window/DOMLoader.XMLHttp.js')
    static.append('js/MIDI.js/js/Widgets/Loader.js')
    static.append('js/MIDI.js/inc/Base64.js')
    static.append('js/MIDI.js/inc/base64binary.js')
    static.append('js/slimmed.js')
    static.extend(['js/visuals.js'])
    onloads = ['midiSetup']
    return render_template('home.html', onloads=onloads, static=static, intervs = musichelp.INTERVALS) 

@app.route("/analytics")
def soon():
    return render_template('soon.html', hide_nav=True)

@app.route("/blog/")
def nullblog():
    return blog("7-5-14")

@app.route("/blog/<post>")
def blog(post):
    static = ['js/visuals.js', 'js/blog.js', 'js/prettify.js']
    onloads = ['blogSetup']
    return render_template('/blogs/%s.html' % (post), static=static, onloads=onloads)

@app.route("/")
@app.route("/synonymgraph")
@app.route("/synonyms")
def synonym():
    static = ['js/visuals.js', 'js/synonyms.js']
    onloads = ['synonymSetup']
    return render_template('syn.html', onloads=onloads, static = static)

@app.route("/multicolumn")
def multicolumn():
    return render_template('multicolumn.html')

@app.route("/foliage")
def foliage():
    return music(hide_nav=True)

@app.route("/music")
def music(hide_nav=None):
    static = ['js/visuals.js', 'js/music.js']
    onloads = ['musicSetup']
    return render_template('music.html', onloads=onloads, static = static, hide_nav=hide_nav)

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

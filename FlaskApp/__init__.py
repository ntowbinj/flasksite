from flask import Flask
from inspect import getmembers, isfunction
import config
import mojule
import jinja_filters

app = Flask(__name__)
app.config.from_object(config)

from main import main
from blog import blog
from admin import admin

app.register_blueprint(main)
app.register_blueprint(blog, url_prefix="/blog")
app.register_blueprint(admin, url_prefix="/madmen")

filters = {name: function for name, function in getmembers(jinja_filters) if isfunction(function)}

app.jinja_env.filters.update(filters)

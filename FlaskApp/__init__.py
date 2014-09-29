from flask import Flask
import config
import mojule

app = Flask(__name__)
app.config.from_object(config)
app.config['MOJ'] = mojule

from main import main
from blog import blog
from admin import admin

app.register_blueprint(main)
app.register_blueprint(blog, url_prefix="/blog")
app.register_blueprint(admin, url_prefix="/madmen")


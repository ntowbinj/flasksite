from flask import Flask
import config

app = Flask(__name__)
app.config.from_object(config)

from main import main
from blog import blog

app.register_blueprint(main)
app.register_blueprint(blog, url_prefix="/blog")


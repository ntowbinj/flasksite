from . import blog
from .. import models
from flask import render_template, request, abort, session
from jinja2 import TemplateNotFound

@blog.route("/")
def nullblog():
    return blog(None)

@blog.route("/<date>")
def post(date):
    try:
        if not date:
            post = models.Post.get()[0]
        else:
            post = models.Post.get().where(models.Post.date == date)
        return render_template('blog.html', content = post.text)
    except TemplateNotFound:
        abort(404)


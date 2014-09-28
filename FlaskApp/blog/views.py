from . import blog
from flask import render_template, request, abort, session
from jinja2 import TemplateNotFound

@blog.route("/")
def nullblog():
    return blog("9-7-14")

@blog.route("/<post>")
def blog(post):
    try:
        return render_template('/blogs/%s.html' % (post))
    except TemplateNotFound:
        abort(404)


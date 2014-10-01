from . import blog
from ..models import *
from flask import redirect, url_for, g
from flask import render_template, request, abort, session
from jinja2 import TemplateNotFound
import peewee

@blog.route("/")
def nullblog():
    latest = Post.select().where(Post.live == True).order_by(-1*Post.date).limit(1)[0]
    return post(latest.date)

@blog.route("/<date>")
def post(date):
    index = Post.select(Post.date, Post.title).where(Post.live == True).order_by(-1*Post.date)
    try:
        post = Post.get(Post.date == date)
        if post.live or 'logged_in' in session:
            return render_template('/blogs/post.html', post=post, tags=post.tags(), index=index)
    except peewee.DoesNotExist:
        pass
    return redirect(url_for('blog.nullblog'))

@blog.route("/tag/<tagname>")
def tag(tagname):
    try:
        tag = Tag.get(Tag.name == tagname)
        taglist = Tag.select()
        return render_template(
                '/blogs/tag.html', 
                tag=tag, 
                posts=tag.posts(include_text=False).order_by(-1*Post.date), 
                taglist=taglist
                )
    except peewee.DoesNotExist:
        abort(404)

@blog.before_request
def open_db():
    g.db = database
    g.db.connect()

@blog.after_request
def close_db(response):
    g.db.close()
    return response

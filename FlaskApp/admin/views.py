from . import admin
from ..models import*
from auth import login_required

from flask import render_template, redirect, request, url_for, current_app
from auth import *
import peewee

@admin.route("/goblin", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['password'] == current_app.config['PASSWORD']:
            session['logged_in'] = True
            return redirect(url_for('.test'))
    return render_template('login.html')

@admin.route("/goblout")
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('blog.nullblog'))


@admin.route("/post")
@login_required
def posts():
    posts = Post.select()
    return render_template("admin/posts.html", posts=posts)

@admin.route("/post/<date>", methods=['POST', 'GET'])
@login_required
def post(date):
    form = request.form
    if request.method == 'POST':
        tags = form['tags'].split(',')
        args = map(lambda k: form[k], ['title', 'date', 'text', 'live']) + [tags]
        post = Post.create_or_update(*args)
        return redirect(url_for('admin.posts'))
    else:
        try:
            post = Post.get(Post.date == date)
        except peewee.DoesNotExist:
            post = Post()
        tags = post.tags()
        return render_template("admin/post.html", post=post, tags=tags)




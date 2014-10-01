from . import admin
from ..models import*
from auth import login_required

from flask import render_template, redirect, request, url_for, current_app, g
from auth import *
import peewee

@admin.route("/goblin", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['password'] == current_app.config['PASSWORD']:
            session['logged_in'] = True
            return redirect(url_for('.posts'))
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
        post_attrs = {k:form[k] for k in form.keys()}
        tags = post_attrs.pop('tags').split(',')
        Post.create_or_update(post_attrs, tags)
        return redirect(url_for('admin.posts'))
    else:
        try:
            post = Post.get(Post.date == date)
        except peewee.DoesNotExist:
            post = Post.get()
        return render_template("admin/post.html", post=post, tags=post.tags())

@admin.route("/post/delete/<date>")
@login_required
def deletepost(date):
    try:
        post = Post.get(Post.date == date)
        post.delete_instance(recursive=True)
    except peewee.DoesNotExist:
        pass
    return redirect(url_for('admin.posts'))

@admin.before_request
def open_db():
    g.db = database
    g.db.connect()

@admin.after_request
def close_db(response):
    g.db.close()
    return response




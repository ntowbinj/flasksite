from flask import session, redirect, url_for
from functools import wraps

def login_required(f):
    @wraps(f)
    def inner(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect(url_for('.login'))
    return inner


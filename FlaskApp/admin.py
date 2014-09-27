from flask import session
from flask import redirect, url_for
from functools import wraps

def login_required(f):
    @wraps(f)
    def inner():
        if not 'logged_in' in session:
            return redirect(url_for("default"))
        else:
            return f()
    return inner




from app.main import main
from flask import redirect, url_for

@main.route('/')
def index():
    """
    Redirects to the index.html file in the static folder. 
    """
    return redirect(url_for('static', filename='index.html'))
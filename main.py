from flask import Flask, render_template
import logging

import secrets


app = Flask(__name__)
Client_ID = secrets.WEB_CLIENT_ID


@app.route("/")
def index():
    logging.info('index page')
    return render_template('index.html', Client_ID=Client_ID)


@app.route("/upload")
def upload():
    logging.info('upload page %s' % Client_ID)
    return render_template('upload.html', Client_ID=Client_ID)


@app.route("/camera")
def camera():
    logging.info('camera page')
    return render_template('camera.html')


@app.route("/profile")
def profile():
    logging.info('profile page')
    return render_template('profile.html')


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404


if __name__ == "__main__":
    app.run(debug=True)

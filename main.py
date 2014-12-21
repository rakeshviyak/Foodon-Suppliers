from flask import Flask, render_template, request
import logging
from apiclient.discovery import build
from urlparse import urlparse

import secrets

app = Flask(__name__)
Client_ID = secrets.WEB_CLIENT_ID


@app.route("/")
def index():
    logging.info('index page')
    return render_template('index.html', Client_ID=Client_ID)


@app.route("/upload")
def upload():
    logging.info('upload page')
    return render_template('upload.html', Client_ID=Client_ID)


@app.route("/camera")
def camera():
    logging.info('camera page')
    return render_template('camera.html')


@app.route("/seller/<sellerid>")
def profile(sellerid):
    logging.info("Seller id %s" % sellerid)
    URL = urlparse(request.url)
    discovery_url = '%s://%s/_ah/api/discovery/v1/apis/%s/%s/rest' % (
        URL.scheme, URL.netloc, secrets.API_NAME, secrets.API_VERSION)
    logging.info(discovery_url)
    # Build a service object for interacting with the API.
    service = build(
        secrets.API_NAME, secrets.API_VERSION, discoveryServiceUrl=discovery_url)
    # Fetch seller from the api
    response = service.sellerprofile().list(sellerid=sellerid).execute()
    logging.info(response)
    return render_template('profile.html', Client_ID=Client_ID, response=response['items'][0])


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404


if __name__ == "__main__":
    app.run(debug=True)

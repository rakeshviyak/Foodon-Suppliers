# Copy this file into secrets.py and set keys, secrets and scopes.

# This is a session secret key used by webapp2 framework.
# Get 'a random and long string' from here:
# http://clsc.net/tools/random-string-generator.php
# or execute this from a python shell: import os; os.urandom(64)

import os
import logging

CURRENT_VERSION_ID = os.environ.get('CURRENT_VERSION_ID', None)
if os.environ.get('SERVER_SOFTWARE', '').startswith('Google App Engine'):
    DEVELOPMENT = False
else:
    DEVELOPMENT = True

PRODUCTION = not DEVELOPMENT
DEBUG = DEVELOPMENT

API_NAME = 'myapi'
API_VERSION = 'v1'
API_DESCRIPTITON = 'Foodon API'

SESSION_KEY = "a very long and secret session key goes here asjhgsd kjagshfhjsd jhgsad"


def devorprod(envi, devid, prodid):
    if envi:
        logging.info("Envi: Developement")
        return devid
    else:
        logging.info("Envi: Production")
        return prodid

# Google APIs
Web_client_id_prod = '935842685891-6f45bbk0ivkp73pk8kptap1rkfvfo9oa.apps.googleusercontent.com'
Web_client_id_dev = '935842685891-akaa53kqu9v86pcnh5kn4j41kaltnd18.apps.googleusercontent.com'

WEB_CLIENT_ID = devorprod(DEVELOPMENT, Web_client_id_dev, Web_client_id_prod)


ANDROID_CLIENT_ID = 'replace this with your Android client ID'
IOS_CLIENT_ID = 'replace this with your iOS client ID'
ANDROID_AUDIENCE = WEB_CLIENT_ID

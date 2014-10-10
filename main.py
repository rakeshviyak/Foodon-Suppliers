from flask import Flask,jsonify,render_template,request
import logging
from google.appengine.api import mail


app = Flask(__name__)


@app.route("/")
def index():
	logging.info('index page')
   	return render_template('index.html')

@app.route('/_add_numbers')
def add_numbers():
	"""Add two numbers server side, ridiculous but well..."""
	a = request.args.get('a', 0, type=str)
	logging.info("success " + a);
	result=jsonify(result=("success"+a))
	mail.send_mail(sender="Lets go for dinner.com Support <rakeshviyak@gmail.com>",
              to="rakeshviyak@gmail.com",
              subject="sucess"+a,
              body="testdfsas")


	return result	


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

	
if __name__ == "__main__":
    app.run(debug=True)
import json

from flask import Flask, jsonify
from flask_cors import CORS

from analyze import analyze_company
from utils import validate_response

app = Flask(__name__)
CORS(app)

@app.route('/company/<name>', methods=['GET'])
def greet(name):
    result = analyze_company(name)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
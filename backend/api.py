from flask import Flask, jsonify
from analyze import analyze_company

app = Flask(__name__)

@app.route('/company/<name>', methods=['GET'])
def greet(name):
    result = analyze_company(name)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request
import os

from neuro.network import neuro_network


app = Flask(__name__)


@app.route('/determine_digit', methods=['GET'])
def index():
    filepath = request.args.get("filepath")

    if not os.path.exists(filepath):
        return "404 file not exist"

    return neuro_network(filepath)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

from flask import Flask, request
import os

from neuro.network import neuro_network
from tree.tree import make_model, do_a_decision


app = Flask(__name__)


@app.route('/determine_digit', methods=['GET'])
def neuro():
    filepath = request.args.get("filepath")

    if not os.path.exists(filepath):
        return "404 file not exist"

    return neuro_network(filepath)


@app.route('/make_tree', methods=['GET'])
def make_tree():
    filepath = request.args.get("filepath")

    if not os.path.exists(filepath):
        return "404 file not exist"

    return make_model(filepath)


@app.route('/get_decision', methods=['GET'])
def make_decision():
    row = request.args.get("row").split(",")

    if not os.path.exists("tree/model/model.json"):
        return "404 model not exist"

    return do_a_decision(row)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

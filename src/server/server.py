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
    max_depth = request.args.get("max_depth")
    min_samples_leaf = request.args.get("min_samples_leaf")
    max_leaf_nodes = request.args.get("max_leaf_nodes")

    if max_depth != "None":
        max_depth = int(max_depth)
    else:
        max_depth = None

    if min_samples_leaf != "None":
        min_samples_leaf = int(min_samples_leaf)
    else:
        min_samples_leaf = 1

    if max_leaf_nodes != "None":
        max_leaf_nodes = int(max_leaf_nodes)
    else:
        max_leaf_nodes = None

    if not os.path.exists(filepath):
        return "404 file not exist"

    return make_model(filepath, max_depth, min_samples_leaf, max_leaf_nodes)


@app.route('/get_decision', methods=['GET'])
def make_decision():
    row = request.args.get("row").split(",")

    if not os.path.exists("tree/model/model.json"):
        return "404 model not exist"

    return do_a_decision(row)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

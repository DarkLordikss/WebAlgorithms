import math
import csv
import json


# Получаем ключевые значения
def get_target_values(data):
    target_values = set()

    for row in data:
        target_values.add(row[-1])

    return target_values


# Функция для подсчета энтропии
def find_entropy(target_col):
    count = {}
    for row in target_col:
        if row not in count:
            count[row] = 0
        count[row] += 1
    entropy = 0.0
    for key in count:
        prob = float(count[key]) / len(target_col)
        entropy -= prob * math.log(prob, 2)
    return entropy


# Функция для разбиения данных по заданному столбцу
def get_split(data, col):
    values = set([row[col] for row in data])
    best_split_value = None
    best_split_score = float('inf')
    best_split_groups = None
    for value in values:
        left = []
        right = []
        for row in data:
            if row[col] == value:
                left.append(row)
            else:
                right.append(row)
        left_entropy = find_entropy([row[-1] for row in left])
        right_entropy = find_entropy([row[-1] for row in right])
        score = (len(left) / len(data)) * left_entropy + (len(right) / len(data)) * right_entropy
        if score < best_split_score:
            best_split_score = score
            best_split_value = value
            best_split_groups = (left, right)
    return {'col': col, 'value': best_split_value, 'groups': best_split_groups, 'score': best_split_score}


# Функция для построения дерева решений
# max_depth задает максимальную глубину дерева
# min_samples_leaf задает минимальное количество образцов, которые должны быть в листовом узле
# max_leaf_nodes задает максимальное количество листовых узлов.
def build_tree(data, target_values, max_depth=None, min_samples_leaf=1, max_leaf_nodes=None):
    target_col = [row[-1] for row in data]

    if len(set(target_col)) == 1:
        return target_col[0]
    if len(data[0]) == 1:
        return max(set(target_col), key=target_col.count)
    if max_depth is not None and max_depth <= 0:
        return max(set(target_col), key=target_col.count)
    if len(data) <= min_samples_leaf:
        return max(set(target_col), key=target_col.count)
    if max_leaf_nodes is not None and max_leaf_nodes <= 1:
        return max(set(target_col), key=target_col.count)

    best_split = None
    best_split_score = float('inf')

    for i in range(len(data[0]) - 1):
        split = get_split(data, i)
        if split['score'] < best_split_score:
            best_split = split
            best_split_score = split['score']
    if best_split is None:
        return max(set(target_col), key=target_col.count)

    left_group, right_group = best_split['groups']

    if not left_group or not right_group:
        return max(set(target_col), key=target_col.count)

    if max_depth is not None:
        left_branch = build_tree(left_group, target_values, max_depth=max_depth - 1, min_samples_leaf=min_samples_leaf,
                                 max_leaf_nodes=max_leaf_nodes - 1 if max_leaf_nodes is not None else None)
        right_branch = build_tree(right_group, target_values, max_depth=max_depth - 1,
                                  min_samples_leaf=min_samples_leaf,
                                  max_leaf_nodes=max_leaf_nodes - 1 if max_leaf_nodes is not None else None)
    elif max_leaf_nodes is not None:
        left_branch = build_tree(left_group, target_values, max_leaf_nodes=max_leaf_nodes - 1,
                                 min_samples_leaf=min_samples_leaf)
        right_branch = build_tree(right_group, target_values, max_leaf_nodes=max_leaf_nodes - 1,
                                  min_samples_leaf=min_samples_leaf)
    else:
        left_branch = build_tree(left_group, target_values)
        right_branch = build_tree(right_group, target_values)

    return {'col': best_split['col'], 'value': best_split['value'], 'left': left_branch, 'right': right_branch}


# Сделать предсказание на основе прохода по дереву
def predict(row, tree, way):
    if isinstance(tree, dict):
        value = tree['value']
        if row[tree['col']] == value:
            way.append("left")
            return predict(row, tree['left'], way)
        else:
            way.append("right")
            return predict(row, tree['right'], way)
    else:
        return tree


# Обучить дерево на выборке
def make_model(filepath, max_depth, min_samples_leaf, max_leaf_nodes):
    data = []

    with open(filepath, 'r', newline='') as csvfile:
        file = csv.reader(csvfile, delimiter=',', quotechar='|')

        for row in file:
            data.append(row)

    tree = build_tree(data, get_target_values(data), max_depth, min_samples_leaf, max_leaf_nodes)

    with open("src/server/tree/model/model.json", 'w') as file:
        json.dump(tree, file)

    return tree


# Принять решение и вернуть путь в дереве
def do_a_decision(row):
    way = []

    with open('src/server/tree/model/model.json', 'r') as file:
        tree = json.load(file)

    response = {
        "decision": predict(row, tree, way),
        "way": way
    }

    return json.dumps(response)

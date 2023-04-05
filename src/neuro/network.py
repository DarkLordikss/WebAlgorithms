import numpy as np
import json
import gzip

import process_image

# Константы нейросети
INPUT_LAYER = 784
HIDDEN_LAYER = 600
OUT_LAYER = 10


# Загружаем тренировочные и тестовые данные MNIST
def load_mnist():
    with gzip.open('mnist/train-images-idx3-ubyte.gz', 'rb') as f:
        train_images = np.frombuffer(f.read(), np.uint8, offset=16).reshape(-1, 28*28)
    with gzip.open('mnist/train-labels-idx1-ubyte.gz', 'rb') as f:
        train_labels = np.frombuffer(f.read(), np.uint8, offset=8)
    with gzip.open('mnist/t10k-images-idx3-ubyte.gz', 'rb') as f:
        test_images = np.frombuffer(f.read(), np.uint8, offset=16).reshape(-1, 28*28)
    with gzip.open('mnist/t10k-labels-idx1-ubyte.gz', 'rb') as f:
        test_labels = np.frombuffer(f.read(), np.uint8, offset=8)

    # Преобразуем данные в формат, пригодный для обучения нейросети
    train_data_ = list(zip(train_images / 255.0, np.eye(10)[train_labels]))
    test_data_ = list(zip(test_images / 255.0, np.eye(10)[test_labels]))

    return train_data_, test_data_


# Мягкий максимум
def softmax(x):
    out = np.exp(x)

    return out / np.sum(out)


# Линейная функция
def re_lu(x):
    return np.maximum(x, 0)


# Получаем результат
def forward(x, w1_, w2_, b1_, b2_):
    t1 = x @ w1_ + b1_
    h1 = re_lu(t1)
    t2 = h1 @ w2_ + b2_
    z = softmax(t2)

    return z


# Обучение нейросети
def make_new_model(train_data_, test_data_, learning_rate, epochs, batch_size):
    # Задаем начальные веса и сдвиги
    w1_ = np.random.normal(0.0, 1.0/np.sqrt(INPUT_LAYER), (INPUT_LAYER, HIDDEN_LAYER))
    b1_ = np.zeros((1, HIDDEN_LAYER))
    w2_ = np.random.normal(0.0, 1.0/np.sqrt(HIDDEN_LAYER), (HIDDEN_LAYER, OUT_LAYER))
    b2_ = np.zeros((1, OUT_LAYER))

    # Идем по эпохам
    for epoch in range(epochs):
        # Миксуем данные
        np.random.shuffle(train_data_)

        # Идем по мини сериям
        for i in range(0, len(train_data_), batch_size):
            print("Epoch {}: {} data from {}".format(epoch, i, len(train_data_)))

            # Получаем серию
            batch = train_data_[i:i+batch_size]

            # Получаем градиенты
            grad_w1 = np.zeros_like(w1_)
            grad_b1 = np.zeros_like(b1_)
            grad_w2 = np.zeros_like(w2_)
            grad_b2 = np.zeros_like(b2_)

            # Идем по образцам
            for x, y in batch:
                # Прямой проход
                t1 = x @ w1_ + b1_
                h1 = re_lu(t1)
                t2 = h1 @ w2_ + b2_
                z = softmax(t2)

                # Обратный проход
                dz = z - y
                dt2 = dz
                grad_w2 += np.outer(h1, dt2)
                grad_b2 += dt2
                dh1 = dt2 @ w2_.T
                dt1 = dh1 * (t1 > 0)
                grad_w1 += np.outer(x, dt1)
                grad_b1 += dt1

            # Обновляем веса и сдвиги
            w2_ -= learning_rate * grad_w2 / len(batch)
            b2_ -= learning_rate * grad_b2 / len(batch)
            w1_ -= learning_rate * grad_w1 / len(batch)
            b1_ -= learning_rate * grad_b1 / len(batch)

        # Оцениваем результат
        accuracy = evaluate(test_data_, w1_, w2_, b1_, b2_)
        print("Epoch {}: accuracy {} %".format(epoch, accuracy))

    # Сохраняем результат
    with open('model/model.json', 'w') as file:
        data_ = {
            "layers": [
                {"weights": w1_.transpose().tolist(), "biases": b1_.tolist()},
                {"weights": w2_.transpose().tolist(), "biases": b2_.tolist()}
            ]
        }
        json.dump(data_, file)
    print("Training complete. Model saved to model")


# Оценка точности
def evaluate(data_, w1_, w2_, b1_, b2_):
    num_correct = 0
    for x, y in data_:
        z = forward(x, w1_, w2_, b1_, b2_)
        if np.argmax(z) == np.argmax(y):
            num_correct += 1
    accuracy = num_correct / len(data_) * 100

    return accuracy


# Создание модели нейросети
def make_model(learning_rate=0.1, epochs=30, batch_size=32):
    train_data, test_data = load_mnist()
    make_new_model(train_data, test_data, learning_rate, epochs, batch_size)


# Инициализация и использование нейросети
def neuro_network(filepath):
    with open('model/model.json', 'r') as digits:
        data = json.load(digits)
        w1 = np.array(data['layers'][0]['weights']).transpose()
        w2 = np.array(data['layers'][1]['weights']).transpose()
        b1 = np.array(data['layers'][0]['biases'])
        b2 = np.array(data['layers'][1]['biases'])

    img = process_image.prepare_digit(filepath)
    forward_result = forward(np.array(img).reshape(1, 784), w1, w2, b1, b2)

    digit = np.argmax(forward_result)
    accuracy = round(forward_result[0][np.argmax(forward_result)] * 100, 2)

    response = {"digit":    str(digit),
                "accuracy": str(accuracy)}

    return json.dumps(response)

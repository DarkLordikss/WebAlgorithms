from scipy.ndimage.measurements import center_of_mass
import cv2
import math
import numpy as np


# Выполняем смещение
def shift(img, sx, sy):
    rows, cols = img.shape
    matrix = np.float32([[1, 0, sx], [0, 1, sy]])
    shifted = cv2.warpAffine(img, matrix, (cols, rows))

    return shifted


# Определяем сдвиг для центровки изображения
def get_best_shift(img):
    cy, cx = center_of_mass(img)
    rows, cols = img.shape
    shift_x = np.round(cols / 2.0 - cx).astype(int)
    shift_y = np.round(rows / 2.0 - cy).astype(int)

    return shift_x, shift_y


# Подготавливаем картинку для нейросети
def prepare_digit(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    gray = 255 - img
    (thresh, gray) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

    while np.sum(gray[0]) == 0:
        gray = gray[1:]

    while np.sum(gray[:, 0]) == 0:

        gray = np.delete(gray, 0, 1)

    while np.sum(gray[-1]) == 0:
        gray = gray[:-1]

    while np.sum(gray[:, -1]) == 0:
        gray = np.delete(gray, -1, 1)

    rows, cols = gray.shape

    if rows > cols:
        factor = 20.0 / rows
        rows = 20
        cols = int(round(cols * factor))
        gray = cv2.resize(gray, (cols, rows))
    else:
        factor = 20.0 / cols
        cols = 20
        rows = int(round(rows * factor))
        gray = cv2.resize(gray, (cols, rows))

    cols_padding = (int(math.ceil((28 - cols) / 2.0)), int(math.floor((28 - cols) / 2.0)))
    rows_padding = (int(math.ceil((28 - rows) / 2.0)), int(math.floor((28 - rows) / 2.0)))

    gray = np.lib.pad(gray, (rows_padding, cols_padding), 'constant')

    shift_x, shift_y = get_best_shift(gray)
    shifted = shift(gray, shift_x, shift_y)

    gray = shifted
    img = gray / 255.0
    img = np.array(img).reshape(-1, 28, 28, 1)

    return img

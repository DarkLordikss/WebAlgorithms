![React](https://media.tproger.ru/uploads/2016/10/reactmini.png)
# Web-проект c очень "интересными алогитмами" 

Front-end проект на ReactJS для визуализации "интересных" алгоритмов.

## Скрипты

Для подрузки модулей:
### `npm install`

Для старта проекта:

### `npm start`

## Как должны быть устроены функции для импорта другие в модули

```
function fName(args) {
    if (at least one of args is undefined){
        return;
    }
    your code;
    return your_result;
}

export {fName};
```

## Правильный импорт функций в основной модуль:

```
this:

import {functionName1, functionName2, ... , functionNameN} from "./path_to_module/moduleName.js"

or this (if module in other folder):

import {functionName1, functionName2, ... , functionNameN} from "../path_to_module/moduleName.js"
```

## Архитектура проекта

### `/package.json` - файл с зависимостями

### `/src/` - исходным код

### `/public/` - манифест, фавикон, и прочая публичная информация

### `/src/scripts/` - js-скрипты

### `/src/pages/` - файлы страниц сайта

### `/src/pages/persons` - декоративные персонажи сайта

### `/src/pages/persons/sprites` - спрайты персонажей

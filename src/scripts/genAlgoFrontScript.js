//Импорт отдельных функций из нужных модулей
import {findShortestRouteGen} from "./genAlgo";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let pointsBox = "#pointing_box";
let pointsCounter = "#points_counter"
let pointsPosArray = [];

let colors = ["#9BFFD4", "#9BFFAF", "#9EFF9B", "#AFFF9B",
"#C3FF9B", "#D4FF9B", "#E5FF9B", "#F6FF9B", "#FFF99B",
"#FFE386", "#FFC772", "#FF9B4E", "#FF6F3A", "#FF4022",
"#D40078", "#A500B0"]

let text_colors = ["black", "black", "black", "black", "black", "black", "black", "black", "black", "black",
"white", "white", "white", "white", "white", "white"]

/*изменяет размер коробки с точками*/
function resize_pointsBox() {
    let width = window.innerWidth/1.5;
    let height = window.innerHeight/1.5;

    $(pointsBox).css({
        "width": width,
        "height": height,
        "left": width*0.25,
        "top": height*0.25
    });
}

/*возвращает позицию мыши с точкой отсчёта от позиции нужного элемента*/
function get_mousePos_in_element(element, event){
    let mPos = [event.clientX, event.clientY];
    let ePos = [parseInt(element.css("left")), parseInt(element.css("top"))];
    let pointPos = [mPos[0]-ePos[0], mPos[1]-ePos[1]];
    
    return pointPos;
}

/*принимает на вход позицию новой точки [x, y] и индекс точки int, существующей  в массиве
проверяет не слишком ли близко они находятся друг к другу*/
function collide(pos1, point2) {
    let pos2 = pointsPosArray[point2];

    if (((pos1[0]-pos2[0])**2 + (pos1[1]-pos2[1])**2)**0.5 > parseInt($(pointsBox).css("width"))*0.025+5) {
        return true;
    }
    return false;
}

/*анимация тряски при максимальном количестве точек*/
function max_points_count() {
    $(pointsCounter).addClass("dynamic");
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            $(pointsCounter).css({
                "transform": "rotate(5deg)",
                "width": "11vh",
                "height": "3.2vh",
                "font-size": "2.4vh",
                "left": "27vh",
                "top": "2.6vh",
            });
            setTimeout(() => {
                $(pointsCounter).css({
                    "transform": "rotate(0deg)",
                    "width": "11vh",
                    "height": "3.2vh",
                    "font-size": "2.4vh",
                    "left": "27vh",
                    "top": "2.6vh",
                });
                setTimeout(() => {
                    $(pointsCounter).css({
                        "transform": "rotate(-5deg)",
                        "width": "11vh",
                        "height": "3.2vh",
                        "font-size": "2.4vh",
                        "left": "27vh",
                        "top": "2.6vh",
                    });
                    setTimeout(() => {
                        $(pointsCounter).css({
                            "transform": "rotate(0deg)",
                            "width": "11vh",
                            "height": "3.2vh",
                            "font-size": "2.4vh",
                            "left": "27vh",
                            "top": "2.6vh",
                        });
                    }, 20);
                }, 20);
            }, 20);
        }, 80*i);
    }
    setTimeout(() => {
        $(pointsCounter).css({
            "transform": "rotate(0deg)",
            "width": "9vh",
            "height": "2.8vh",
            "font-size": "2vh",
            "left": "28vh",
            "top": "2.8vh",
        });
        $(pointsCounter).removeClass("dynamic");
    }, 80*7);
    
}

/*добавляет точку с заданной позицией в коробку с точками (если это, конечно, возможно)*/
function add_new_point(pos){
    let pointRadius = parseInt($(pointsBox).css("width"))*0.0125;
    if (pos[0]-pointRadius < 0 || pos[1]-pointRadius < 0){
        return;
    }
    if (pointsPosArray.length >= 15){
        max_points_count();
        return;
    }

    for (let index = 0; index < pointsPosArray.length; index++) {
        if (collide(pos, index) === false) {
            return;
        }
        
    }

    let points_count = pointsPosArray.length+1;
    let newPoint = "<div class='point appeared' id='" + (points_count - 1) + "'></div>";
    pointsPosArray.push(pos);
    $(pointsCounter).text(points_count.toString());
    $(pointsCounter).css({
        "background-color": colors[points_count],
        "color": text_colors[points_count]
    });

    $(newPoint).appendTo(pointsBox);
    newPoint = $("#" + (points_count-1));
    newPoint.css({
        "width": 0,
        "height": 0,
        "left": pos[0],
        "top": pos[1],
    });

    setTimeout(() => {
        newPoint.removeClass("appeared");
        newPoint.css({
            "width": pointRadius*2-4,
            "height": pointRadius*2-4,
            "left": pos[0]-pointRadius,
            "top": pos[1]-pointRadius,
        });
    }, 1);
    console.log(pointsPosArray);
}

/*удаляет выбранную точку из коробки с точками*/
function delete_point(element){
    let index = parseInt(element.id);

    let pos = [parseInt($(element).css("left"))+parseInt($(element).css("width"))/2, parseInt($(element).css("top"))+parseInt($(element).css("width"))/2]
    $(element).addClass("appeared");
    $(element).css({
        "width": 0,
        "height": 0,
        "left": pos[0],
        "top": pos[1],
    });
    setTimeout(() => {
        element.remove();
    }, 200);
    for (let i = index; i < pointsPosArray.length; i++) {
        $("#" + i).attr("id", (i-1).toString());
    }
    pointsPosArray.splice(index, 1);
    let points_count = pointsPosArray.length;
    $(pointsCounter).text(points_count);
    $(pointsCounter).css({
        "background-color": colors[points_count],
        "color": text_colors[points_count]
    });
    console.log(pointsPosArray);
}

$(document).ready(function () {
    if($(pointsBox).length !== 1){
        return;
    }
    resize_pointsBox();
    $(pointsBox).mousedown(function (e) {
        if (e.target.id.toString() !== "pointing_box"){
            if ($(e.target).hasClass("point")){
                delete_point(e.target);
            }
        }
        else{
            let mouse_pos = get_mousePos_in_element($(this), e);
            add_new_point(mouse_pos);
        }
    });
});

/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_pointsBox();
});

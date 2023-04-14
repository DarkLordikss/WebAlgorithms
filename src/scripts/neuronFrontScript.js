//Импорт отдельных функций из нужных модулей
// import {findShortestRouteGen} from "./genAlgo";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

import "./entranceAnimation.js";

let start_b = "#start_button";
let clear = "#clear_button";
let canvas = "#drawingField";
let resizer = "#resolutionChanger";
let resolutVal = "#resolutionVal";
let rebrusher = "#brushChanger";
let brushVal = "#brushVal";
let res_id = "#resultShow";
let exit_result = "#resultExit";
let prevX = 0;
let prevY = 0;
let resolution_canv = 50;
let brushSize = 5.0;
let canvDraw = false;
let resultShowing = false;

let robot = undefined;
let rHead = undefined;
let rLeye = undefined;
let rReye = undefined;
let lVRound = undefined;
let rVRound = undefined;
let lVFlat = undefined;
let rVFlat = undefined;

let color_id = 0;
let colors = ["rgb(0, 0, 0)", "rgb(250, 250, 250)", "rgb(222, 0, 0)","rgb(222, 85, 0)","rgb(251, 238, 0)","rgb(30, 222, 0)","rgb(0, 255, 255)","rgb(0, 0, 222)","rgb(140, 0, 255)","rgb(222, 0, 222)"];

let mood_num = [130, 85, 30, 0];
let mood_states = ["angry", "based", "fun", "default"];

/*Изменяет отображаемый размер канваса*/
function resize_canvas() {
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let min = winW;
    if (winW > winH) {
        min = winH;
    }
    let size = min*0.89;
    $(canvas).css({
        "top": winH*0.10-3,
        "left": (winW-size)/2-3,
        "width": size,
        "height": size
    });
    setLimits();
}

/*Изменяет канвас (размер изображения)*/
function editCanvasStyle(resolution=50, colorId=0) {
    $(canvas).attr("width", resolution);
    $(canvas).attr("height", resolution);
    resolution_canv = resolution;
    let field = document.getElementById("drawingField");
    let ctx = field.getContext("2d");
    ctx.fillStyle = colors[colorId];
    setLimits();
}

/*изменяет позицию вывода результата*/
function reset_result(result_txt, accuracy_txt) {
    let r_w = parseInt($(res_id).css("width"))/2;
    let winW = window.innerWidth/2;
    $(res_id).css("left", (winW-r_w).toString()+"px");
    let new_result = "<div id='text_result' style='margin:6vh' className='unselectable'>Мне кажется, что это "+result_txt+"<br \>С вероятностью "+accuracy_txt+"%</div>"
    $(res_id).append(new_result);
    resultShowing = true;
    $("#resultBackground").css("display", "block");
}

/*устанавливает начальную позицию для рисования*/
function setPrevPos(position) {
    let mxS = parseInt($(canvas).css("width"));
    position[0] = parseInt((position[0]/mxS)*resolution_canv);
    position[1] = parseInt((position[1]/mxS)*resolution_canv);
    prevX = position[0];
    prevY = position[1];
    return [prevX, prevY];
}

/*устанавливает ограничения для размера кисти*/
function setLimits(){
    let maxSize = resolution_canv/10;
    if (maxSize < 1){
        maxSize = 1;
    }
    $(rebrusher).attr("max", maxSize);
    if (brushSize > maxSize) {
        brushSize = maxSize;
        let text = brushSize + "px";
        $(brushVal).text(text);
    }
}

/*Закрашивает канвас белым*/
function fillWhite() {
    let field = document.getElementById("drawingField");
    let ctx = field.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, resolution_canv, resolution_canv);
}

/*Рисует на канвасе*/
function drawCanvas(position, shape="circle") {
    let field = document.getElementById("drawingField");
    let ctx = field.getContext("2d");
    let mxS = parseInt($(canvas).css("width"));

    position[0] = parseInt((position[0]/mxS)*resolution_canv)+1;
    position[1] = parseInt((position[1]/mxS)*resolution_canv)+1;

    for (let kind = 0; kind < 10; kind++) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.arc(prevX, prevY, brushSize/2, 0, 2 * Math.PI, false);
        ctx.fillStyle = colors[color_id];
        ctx.fill();
        ctx.closePath();
    }

    let dX = position[0]-prevX;
    let dY = position[1]-prevY;
    let gyp = (dX**2 + dY**2)**0.5;
    if (gyp >= 1) {
        let k = 0;
        if (Math.abs(dX) > Math.abs(dY)){
            k = dY/dX;
            let dir = 1;
            if (dX < 0){
                dir = -1;
            }
            let x = 0;
            while (Math.abs(x) !== parseInt(Math.abs(dX))){
                for (let kind = 0; kind < 10; kind++) {
                    let kkx = x+kind/10;
                    ctx.beginPath();
                    ctx.moveTo(prevX+kkx, prevY+k*kkx);
                    ctx.arc(prevX+kkx, prevY+k*kkx, brushSize/2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = colors[color_id];
                    ctx.fill();
                    ctx.closePath();
                }
                x += dir;
            }
        }
        else{
            k = dX/dY;
            let dir = 1;
            if (dY < 0){
                dir = -1;
            }
            let y = 0;
            while (Math.abs(y) !== parseInt(Math.abs(dY))){
                for (let kind = 0; kind < 10; kind++) {
                    let kky = y+kind/10;
                    ctx.beginPath();
                    ctx.moveTo(prevX+kky*k, prevY+kky);
                    ctx.arc(prevX+kky*k, prevY+kky, brushSize/2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = colors[color_id];
                    ctx.fill();
                    ctx.closePath();
                }
                y += dir;
            }
        }

        prevX = position[0];
        prevY = position[1];
    }
    // prevX = position[0];
    // prevY = position[1];
}

/*возвращает позицию мыши с точкой отсчёта от позиции нужного элемента*/
function get_mousePos_in_element(element, event){
    let mPos = [event.clientX, event.clientY];
    let ePos = [parseInt(element.css("left")), parseInt(element.css("top"))];
    let pointPos = [mPos[0]-ePos[0], mPos[1]-ePos[1]];
    
    return pointPos;
}

/*следование за указателем*/
function animateRobotEyes(e, returning=true) {
    if (!returning) {
        let mPos = [e.clientX, e.clientY];
        let eyesCenter = [0, 0];
        let leftOffset = rLeye.getBoundingClientRect();
        console.log(rLeye.childNodes);
        let rightOffset = rReye.getBoundingClientRect();
        let eyeSize = parseInt($(rLeye).css("width"));
        eyesCenter[0] = (leftOffset.left+rightOffset.left+parseInt($(rLeye).css("width")))/2;
        eyesCenter[1] = (leftOffset.top+rightOffset.top+parseInt($(rLeye).css("width")))/2;

        let dir_L = 1;
        let dir_R = 1;

        let dX_l = mPos[0]-leftOffset.left+eyeSize/2;
        let dY_l = leftOffset.top-eyeSize/2-mPos[1];
        let dX_r = mPos[0]-rightOffset.left+eyeSize/2;
        let dY_r = rightOffset.top-eyeSize/2-mPos[1];

        if (dX_r < 0) {
            dir_R = -1;
        }
        if (dX_l < 0) {
            dir_L = -1;
        }

        console.log([e.clientX, e.clientY]);
        console.log([leftOffset.left, leftOffset.top]);
        let kL = dY_l/dX_l;
        let angleL = Math.atan(kL);
        let kR = dY_r/dX_r;
        let angleR = Math.atan(kR);

        let leftPupil = rLeye.childNodes[0];
        let rightPupil = rReye.childNodes[0];

        $(leftPupil).css({
            "left": eyeSize/4+(eyeSize/4)*Math.cos(angleL)*dir_L,
            "top": eyeSize/4-(eyeSize/4)*Math.sin(angleL)*dir_L,
        });
        $(rightPupil).css({
            "left": eyeSize/4+(eyeSize/4)*Math.cos(angleR)*dir_R,
            "top": eyeSize/4-(eyeSize/4)*Math.sin(angleR)*dir_R,
        });
    }else{
        let leftPupil = rLeye.childNodes[0];
        let rightPupil = rReye.childNodes[0];
        let eyeSize = parseInt($(rLeye).css("width"));
        $(leftPupil).css({
            "left": eyeSize/4,
            "top": eyeSize/4,
            "transition": "0.2s"
        });
        $(rightPupil).css({
            "left": eyeSize/4,
            "top": eyeSize/4,
            "transition": "0.2s"
        });
        setTimeout(() => {
            $(leftPupil).css({
                "transition": "0s"
            });
            $(rightPupil).css({
                "transition": "0s"
            });
        }, 201);
    }
}

/*меняет роботу настроение*/
function animateRobotMood(mood="default"){
    if (mood === "default"){
        $(lVRound).removeClass("applyed");
        $(rVRound).removeClass("applyed");
        $(lVFlat).removeClass("applyed");
        $(rVFlat).removeClass("applyed");
        $(lVFlat).removeClass("based");
        $(rVFlat).removeClass("based");
    }
    else if (mood === "fun"){
        $(lVRound).addClass("applyed");
        $(rVRound).addClass("applyed");
        $(lVFlat).removeClass("applyed");
        $(rVFlat).removeClass("applyed");
        $(lVFlat).removeClass("based");
        $(rVFlat).removeClass("based");
    }
    else if (mood === "based"){
        $(lVRound).removeClass("applyed");
        $(rVRound).removeClass("applyed");
        $(lVFlat).removeClass("applyed");
        $(rVFlat).removeClass("applyed");
        $(lVFlat).addClass("based");
        $(rVFlat).addClass("based");
    }
    else if (mood === "angry"){
        $(lVRound).removeClass("applyed");
        $(rVRound).removeClass("applyed");
        $(lVFlat).addClass("applyed");
        $(rVFlat).addClass("applyed");
        $(lVFlat).removeClass("based");
        $(rVFlat).removeClass("based");
    }
}

$(document).ready(function () {
    if ($(canvas).length > 0) {
        resize_canvas();
        editCanvasStyle();
        fillWhite();

        robot = document.getElementById("robot");
        rHead = robot.childNodes[0];
        rLeye = rHead.childNodes[0];
        rReye = rHead.childNodes[1];
        lVRound = rHead.childNodes[2];
        rVRound = rHead.childNodes[3];
        lVFlat = rHead.childNodes[4];
        rVFlat = rHead.childNodes[5];
        animateRobotEyes();
        animateRobotMood("fun");

        document.getElementById("resolutionChanger").addEventListener("input", (event) => {
            let text = event.target.value + "x" + event.target.value;
            $(resolutVal).text(text);
            editCanvasStyle(event.target.value);
            let k = 0;
            while(k < mood_num.length){
                if (event.target.value >= mood_num[k]){
                    animateRobotMood(mood_states[k]);
                    k += 999;
                }
                k += 1;
            }
        });
        document.getElementById("brushChanger").addEventListener("input", (event) => {
            let text = event.target.value + "px";
            $(brushVal).text(text);
            brushSize = event.target.value;
        });
        document.getElementById("drawingField").addEventListener("mousedown", (event) => {
            canvDraw = true;
            let mPos = get_mousePos_in_element($(canvas), event);
            setPrevPos(mPos);
        });
        document.getElementById("drawingField").addEventListener("mousemove", (event) => {
            let mPos = get_mousePos_in_element($(canvas), event);
            if (canvDraw) {
                drawCanvas(mPos);
            }
            animateRobotEyes(event, false);
        });
        document.getElementById("drawingField").addEventListener("mouseleave", (event) => {
            animateRobotEyes(event, true);
        });
        document.addEventListener("mouseup", (event) => {
            canvDraw = false;
        });
    }
    
    $(".colorOption").mousedown(function () {
        let colors_buttons = $(".colorOption");
        for (let i = 0; i < colors_buttons.length; i++) {
            if ($(colors_buttons[i]).hasClass("pickedCan")) {
                $(colors_buttons[i]).removeClass("pickedCan");
                $(colors_buttons[i]).addClass("defaultCan");   
            }
        }
        
        color_id = parseInt($(this).attr("id").split("_")[1]);
        $(this).removeClass("defaultCan");
        $(this).addClass("pickedCan");
    });
    $("#clear_button").mousedown(function () {
        fillWhite();
    });
    $(exit_result).mousedown(function () {
        $("#resultBackground").css("display", "none");
        $("#text_result").remove();
        resultShowing = false;
    });
    $("#send_button").mousedown(async function () {
        if (!resultShowing){
            let myImage = document.getElementById("drawingField");
            let imageData = myImage.toDataURL('image/png');
            let response = await fetch("http://127.0.0.1:5000/determine_digit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image_data: imageData }),
            })
            let data = await response.json();
            reset_result(data.digit.toString(), (data.accuracy).toString());
        }
    })
});



/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_canvas();
});

//Импорт отдельных функций из нужных модулей
// import {findShortestRouteGen} from "./genAlgo";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let start_b = "#start_button";
let clear = "#clear_button";
let canvas = "#drawingField";
let resizer = "#resolutionChanger";
let resolutVal = "#resolutionVal";
let rebrusher = "#brushChanger";
let brushVal = "#brushVal";
let prevX = 0;
let prevY = 0;
let resolution_canv = 50;
let brushSize = 5.0;
let canvDraw = false;

let robot = undefined;
let rHead = undefined;
let rLeye = undefined;
let rReye = undefined;

let color_id = 0;
let colors = ["rgb(0, 0, 0)", "rgb(250, 250, 250)", "rgb(222, 0, 0)","rgb(222, 85, 0)","rgb(251, 238, 0)","rgb(30, 222, 0)","rgb(0, 255, 255)","rgb(0, 0, 222)","rgb(140, 0, 255)","rgb(222, 0, 222)"];

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

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.arc(prevX, prevY, brushSize/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = colors[color_id];
    ctx.fill();
    ctx.closePath();

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
            while (Math.abs(x) != parseInt(Math.abs(dX))){
                ctx.beginPath();
                ctx.moveTo(prevX+x, prevY+k*x);
                ctx.arc(prevX+x, prevY+k*x, brushSize/2, 0, 2 * Math.PI, false);
                ctx.fillStyle = colors[color_id];
                ctx.fill();
                ctx.closePath();
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
            while (Math.abs(y) != parseInt(Math.abs(dY))){
                ctx.beginPath();
                ctx.moveTo(prevX+y*k, prevY+y);
                ctx.arc(prevX+y*k, prevY+y, brushSize/2, 0, 2 * Math.PI, false);
                ctx.fillStyle = colors[color_id];
                ctx.fill();
                ctx.closePath();
                y += dir;
            }
        }

        prevX = position[0];
        prevY = position[1];
    }
    // prevX = position[0];
    // prevY = position[1];
}

/*переводит радианды в градусы*/
function toDEG(rad) {
    return (rad * 180) / Math.PI;
}

/*возвращает позицию мыши с точкой отсчёта от позиции нужного элемента*/
function get_mousePos_in_element(element, event){
    let mPos = [event.clientX, event.clientY];
    let ePos = [parseInt(element.css("left")), parseInt(element.css("top"))];
    let pointPos = [mPos[0]-ePos[0], mPos[1]-ePos[1]];
    
    return pointPos;
}

function animateRobotEyes(e, returning=true) {
    if (!returning) {
        let mPos = [e.clientX, e.clientY-parseFloat($("#header").css("height"))];
        let eyesCenter = [0, 0];
        let leftOffset = $(rLeye).offset();
        let rightOffset = $(rReye).offset();
        let eyeSize = parseInt($(rLeye).css("width"));
        eyesCenter[0] = (leftOffset.left+rightOffset.left+parseInt($(rLeye).css("width")))/2;
        eyesCenter[1] = (leftOffset.top+rightOffset.top+parseInt($(rLeye).css("width")))/2;
        let dX_l = mPos[0]-leftOffset.left-eyeSize/2;
        let dY_l = leftOffset.top-eyeSize/2-mPos[1];
        let dX_r = mPos[0]-rightOffset.left-eyeSize/2;
        let dY_r = rightOffset.top-eyeSize/2-mPos[1];
        let kL = dY_l/dX_l;
        let angleL = Math.atan(kL);
        console.log(toDEG(angleL), "angleL", dX_l, dY_l, leftOffset.top, mPos[1]);
        let kR = dY_r/dX_r;
        let angleR = Math.atan(kR);
        console.log(toDEG(angleR), "angleR", dX_r, dY_r, rightOffset.top, mPos[1]);
        let leftPupil = rLeye.childNodes[0];
        let rightPupil = rReye.childNodes[0];
        // console.log(angleL, "angleL", eyeSize/2+(eyeSize/2)*Math.sin(angleL), eyeSize/2+(eyeSize/2)*Math.cos(toDEG(angleL)));
        // console.log(angleR, "angleR", eyeSize/2+(eyeSize/2)*Math.sin(angleR));
        let minusBorder = window.innerHeight*0.001;
        let minusPupil = parseFloat($(leftPupil).css("width"))
        $(leftPupil).css({
            "left": eyeSize/2-(minusBorder+minusPupil)+(eyeSize/2)*Math.cos(angleL),
            "top": eyeSize/2-(minusBorder+minusPupil)-(eyeSize/2)*Math.sin(angleL),
        });
        $(rightPupil).css({
            "left": eyeSize/2-(minusBorder+minusPupil)+(eyeSize/2)*Math.cos(angleR),
            "top": eyeSize/2-(minusBorder+minusPupil)-(eyeSize/2)*Math.sin(angleR),
        });
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
        animateRobotEyes();

        document.getElementById("resolutionChanger").addEventListener("input", (event) => {
            let text = event.target.value + "x" + event.target.value;
            $(resolutVal).text(text);
            editCanvasStyle(event.target.value);
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
            animateRobotEyes(event, false)
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
    $("#send_button").mousedown(function () {
        let myImage = document.getElementById("drawingField");
        let imageData = myImage.toDataURL('image/png');
        fetch("http://127.0.0.1:5000/determine_digit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_data: imageData }),
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
        // let data = await response.json();
        // console.log(data);
    })
});



/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_canvas();
});

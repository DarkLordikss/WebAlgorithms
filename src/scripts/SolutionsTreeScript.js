//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let parameters = ["state", "temperature", "pressure", "bool", "answer"];
let aimsLns = [3,3,2,2,2];

let sending = ["", "", "", "", ""];
let send_ind = [[-1, -1],[-1, -1],[-1, -1],[-1, -1],[-1, -1]];
let prev_drawed = 0;

let sendB = "#send_button_t";

let startY = 0.07;

function drawWithDelay(delay, x, y) {
    setTimeout(() => {
        let field = document.getElementById("drawingTree");
        let ctx = field.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgb(200, 255, 205)";
        ctx.fill();
        ctx.closePath();
    }, delay);
}

function eraseTreePoints() {
    let field = document.getElementById("drawingTree");
    let ctx = field.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, field.width, field.height);
    ctx.closePath();
    prev_drawed = 0;
}

function drawTreePoints() {
    let maxLen = 0;
    for (let i = 0; i < sending.length; i++) {
        if (sending[i] == "") {
            break;
        }
        maxLen += 1;
    }
    let x = 0.5035;
    let y = 0;
    if (prev_drawed != 0){
        x = send_ind[prev_drawed-1][0];
        y = send_ind[prev_drawed-1][1]+send_ind[prev_drawed-1][2]*2;
    }
    let quality = 1000;
    let total_sh = 0;
    for (let i = prev_drawed; i < maxLen; i++) {
        let x_targ = send_ind[i][0];
        let y_targ = send_ind[i][1]+send_ind[i][2];
        let distance = ((x-x_targ)**2 + (y-y_targ)**2)**0.5;
        quality = 700*distance;
        for (let xA = 0; xA < quality+1; xA++) {
            total_sh += 1;
        }
        x = x_targ;
        y = send_ind[i][1]+send_ind[i][2]*2;
    }
    x = 0.5035;
    y = 0;
    if (prev_drawed != 0){
        x = send_ind[prev_drawed-1][0];
        y = send_ind[prev_drawed-1][1]+send_ind[prev_drawed-1][2]*2;
    }
    let prev_sh = 0;
    for (let i = prev_drawed; i < maxLen; i++) {
        let x_targ = send_ind[i][0];
        let y_targ = send_ind[i][1]+send_ind[i][2];
        let distance = ((x-x_targ)**2 + (y-y_targ)**2)**0.5;
        quality = 700*distance;
        for (let xA = 0; xA < quality+1; xA++) {
            let xF = xA/quality;
            let yN = ((Math.abs(xF*2)-1)**5 + 1)/2;
            let treePoint = {
                x: (x+xF*(x_targ-x))*window.innerWidth,
                y: (startY+y+(yN*Math.abs(y-y_targ)))*window.innerHeight
            }
            drawWithDelay(prev_sh, treePoint.x, treePoint.y);
            //200*(maxLen**1.5)*(prev_sh/total_sh)**2.2
            prev_sh += 1;
        }
        
        x = x_targ;
        y = send_ind[i][1]+send_ind[i][2]*2;
    }
    prev_drawed = maxLen;
    console.log(send_ind);
    console.log(startY);
}

function resizeTreeD() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    $("#drawingTree").attr("width", w);
    $("#drawingTree").attr("height", h);
}

$(document).ready(function () {
    if($("#treeBox").length === 0){
        return;
    }
    
    $(".checkingBox").mousedown(function () { 
        if($(this).hasClass("unlocked")){
            if($(this).hasClass("unchecked")){
                let sames_id = 0;
                let myId = $(this).attr("id");
                for (let i = 0; i < parameters.length; i++) {
                    if($(this).hasClass(parameters[i])){
                        sames_id = i;
                    }
                }
                let sames = $("."+parameters[sames_id]);
                let myPos = [($(this)[0].offsetLeft + parseInt($(this).css("width"))/2)/window.innerWidth, $(this)[0].offsetTop/window.innerHeight, (parseInt($(this).css("height"))/2)/window.innerHeight];
                for (let elI = 0; elI < sames.length; elI++) {
                    if ($(sames[elI]).attr("id") !== myId){
                        $(sames[elI]).removeClass("unlocked");
                        $(sames[elI]).addClass("locked");
                    }
                }
                $(this).removeClass("unchecked");
                $(this).addClass("checked");
                sending[sames_id] = myId;
                send_ind[sames_id] = myPos;
                console.log(myPos);
                drawTreePoints();
            }
            else{
                let sames_id = 0;
                let myId = $(this).attr("id");
                for (let i = 0; i < parameters.length; i++) {
                    if($(this).hasClass(parameters[i])){
                        sames_id = i;
                    }
                }
                let sames = $("."+parameters[sames_id]);
                for (let elI = 0; elI < sames.length; elI++) {
                    if ($(sames[elI]).attr("id") !== myId){
                        $(sames[elI]).removeClass("locked");
                        $(sames[elI]).addClass("unlocked");
                    }
                }
                $(this).removeClass("checked");
                $(this).addClass("unchecked");
                sending[sames_id] = "";
                send_ind[sames_id] = [-1, -1];
                eraseTreePoints();
            }
        }
    });
    // $(sendB).mousedown(function () { 
    //     let mycsv = "";
    //     for (let i = 0; i < sending.length; i++) {
    //         if (sending[i] != "") {
    //             if (i > 0){
    //                 mycsv += ",";
    //             }
    //             mycsv += sending[i];
    //         }
    //         else{
    //             break;
    //         }
    //     }
    //     let response = await fetch("http://127.0.0.1:5000/make_tree", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ image_data: imageData }),
    //     })
    //     let data = await response.json();
    //     console.log(data);
    // });
    resizeTreeD();
});

$(window).resize(function () { 
    resizeTreeD();
});
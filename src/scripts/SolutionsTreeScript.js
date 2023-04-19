//правильный импорт jQuery
import { getByAltText } from "@testing-library/react";
import * as $ from "./jQueryMain.js";

let types = ["left", "right"];
let colors = ["rgb(51, 234, 66)", "rgb(236, 46, 39)"];

let file = undefined;
let data = undefined;

let treeLevels = [];
let treeParents = [];
let treeColors = [];

let sendB = "#send_button_t";

function drawWithDelay(delay, x, y, color) {
    setTimeout(() => {
        let field = document.getElementById("drawingTree");
        let ctx = field.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(x-10, y);
        ctx.arc(x-10, y, 2, 0, 2 * Math.PI, false);
        ctx.moveTo(x+10, y);
        ctx.arc(x+10, y, 2, 0, 2 * Math.PI, false);
        ctx.moveTo(x, y-10);
        ctx.arc(x, y-10, 2, 0, 2 * Math.PI, false);
        ctx.moveTo(x, y+10);
        ctx.arc(x, y+10, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgb(10, 0, 0)";
        ctx.fill();
        ctx.closePath();
    }, delay);
}

function enterpritateTree(tree, level, pId=-1, type) {
    if (treeLevels.length <= level) {
        treeLevels.push([]);
        treeParents.push([]);
        treeColors.push([]);
    }
    treeLevels[level].push(tree.value);
    treeParents[level].push(pId);
    treeColors[level].push(colors[types.indexOf(type)]);
    if (typeof tree.left !== "string") {
        enterpritateTree(tree.left, level+1, treeParents[level].length-1, "left");
    }
    else{
        enterpritateVal(tree.left, level+1, treeParents[level].length-1, "left");
    }
    if (typeof tree.right !== "string") {
        enterpritateTree(tree.right, level+1, treeParents[level].length-1, "right");
    }
    else{
        enterpritateVal(tree.right, level+1, treeParents[level].length-1, "right");
    }
}
function enterpritateVal(value, level, pId, type) {
    if (treeLevels.length <= level) {
        treeLevels.push([]);
        treeParents.push([]);
        treeColors.push([]);
    }
    treeLevels[level].push(value);
    treeParents[level].push(pId);
    treeColors[level].push(colors[types.indexOf(type)]);
}

function drawFullTree() {
    resizeTreeD();
    console.log(treeLevels);
    console.log(treeParents);
    for (let lvlI = 0; lvlI < treeLevels.length; lvlI++) {
        let newState = '<div id="state_' + lvlI + '" class="states unselectable"></div>'
        $("#treeBox").append(newState);
        let levelStyle = {
            "margin-left": 46/(treeLevels[lvlI].length+1)+"vw",
            "width": 54/(treeLevels[lvlI].length)+"vw"
        }
        for (let valI = 0; valI < treeLevels[lvlI].length; valI++) {
            let newCheck = '<div id="state_'+lvlI+'_val_'+valI+'" class="checkingBox state unchecked unlocked">'+treeLevels[lvlI][valI]+'</div>'
            $("#state_"+lvlI).append(newCheck);
            $("#state_"+lvlI+"_val_"+valI).css(levelStyle);
            let fS = 3;
            fS = 100/(treeLevels[lvlI].length)/treeLevels[lvlI][valI].length;
            if (fS > 3) {
                fS = 3;
            }
            $("#state_"+lvlI+"_val_"+valI).css("font-size", fS+"vw")
            if (treeParents[lvlI][valI] !== -1) {
                let parentId = "#state_"+(lvlI-1).toString()+"_val_"+treeParents[lvlI][valI];
                let myId = "#state_"+lvlI+"_val_"+valI;
                console.log(parentId, myId);
                let x_par = ($(parentId)[0].offsetLeft + parseInt($(parentId).css("width"))/2)/window.innerWidth;
                let y_par = $(parentId)[0].offsetTop/window.innerHeight+parseInt($(parentId).css("height"))/window.innerHeight;
                let targ = [($(myId)[0].offsetLeft + parseInt($(myId).css("width"))/2)/window.innerWidth, $(myId)[0].offsetTop/window.innerHeight, (parseInt($(myId).css("height"))/2)/window.innerHeight]
                setTimeout(() => {
                    drawTreePoints(x_par, y_par, targ, treeColors[lvlI][valI]);
                }, 200*lvlI);
            }
            else{
                let myId = "#state_"+lvlI+"_val_"+valI;
                let targ = [($(myId)[0].offsetLeft + parseInt($(myId).css("width"))/2)/window.innerWidth, $(myId)[0].offsetTop/window.innerHeight, (parseInt($(myId).css("height"))/2)/window.innerHeight]
                setTimeout(() => {
                    drawTreePoints(0.5, 0, targ, treeColors[lvlI][valI]);
                }, 200*lvlI);
            }
        }
    }
}

function eraseTreePoints() {
    let field = document.getElementById("drawingTree");
    let ctx = field.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, field.width, field.height);
    ctx.closePath();
}

function drawTreePoints(x, y, target, color) {
    let prev_sh = 0;
    let x_targ = target[0];
    let y_targ = target[1]+target[2];
    let distance = ((x-x_targ)**2 + (y-y_targ)**2)**0.5;
    let quality = 2100*distance;
    for (let xA = 0; xA < quality+1; xA++) {
        let xF = xA/quality;
        let yN = ((Math.abs(xF*2)-1)**5 + 1)/2;
        let treePoint = {
            x: (x+xF*(x_targ-x))*window.innerWidth,
            y: (y+(yN*Math.abs(y-y_targ)))*window.innerHeight
        }
        drawWithDelay(prev_sh/8, treePoint.x, treePoint.y, color);
        prev_sh += 1;
    }
}

function resizeTreeD() {
    let w = window.innerWidth;
    let h = (treeLevels.length*0.15+0.15)*window.innerHeight;
    $("#drawingTree").attr("width", w);
    $("#drawingTree").attr("height", h);
    $("#drawingTree").css({
        "height": h,
        "width": w
    });
}

$(document).ready(function () {
    if($("#treeBox").length === 0){
        return;
    }
    $(sendB).mousedown(async function () { 
        if (data !== undefined){
            treeLevels = [];
            treeParents = [];
            eraseTreePoints();
            $("#treeBox").empty();
            enterpritateTree(data, 0);
            drawFullTree();
        }
    });
    $('#dataset').on('change', async function(){
        file = this.files[0];
        $('.input-file-text').html(file.name);
        let formData = new FormData();
        formData.append('file', file);

        let response = await fetch('http://127.0.0.1:5000/make_tree?max_depth=None&min_samples_leaf=1&max_leaf_nodes=None', {
        method: 'POST',
        body: formData
        });

        data = await response.json();
    });
    resizeTreeD();
});

$(window).resize(function () { 
    resizeTreeD();
});
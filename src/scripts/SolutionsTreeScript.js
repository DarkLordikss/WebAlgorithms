//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let types = ["left", "right", "desision"];
let colors = [40, -40, 200];

let file = undefined;
let data = undefined;

let treeLevels = [];
let treeParents = [];
let treeColors = [];

let sendB = "#send_button_t";

let depthEditor = "#maxDethInp";
let samplesEditor = "#minLeafSamplesInp";
let nodesEditor = "#maxLeafNodesInp";
let textInput = "#desisionInp";

let inputCategory = 0;
let desisionShowing = false;

/*Взять depth*/
function getDepth() {
    let depth = $(depthEditor).val();
    if (depth === undefined) {
        return 'None';
    }
    if (depth < 1) {
        depth = 1;
    }
    else if (depth >= 1000){
        depth = 1000;
    }
    $(depthEditor).val(depth);
    return depth;
}

/*Взять samples*/
function getSamples() {
    let samples = $(samplesEditor).val();
    if (samples === undefined) {
        return 'None';
    }
    if (samples < 1) {
        samples = 1;
    }
    else if (samples >= 1000){
        samples = 1000;
    }
    $(samplesEditor).val(samples);
    return samples;
}

/*Взять nodes*/
function getNodes() {
    let nodes = $(nodesEditor).val();
    if (nodes === undefined) {
        return 'None';
    }
    if (nodes < 2) {
        nodes = 2;
    }
    else if (nodes >= 1000){
        nodes = 1000;
    }
    $(nodesEditor).val(nodes);
    return nodes;
}

/*Взять текст*/
function getText() {
    let text = $(textInput).val();
    if (text === undefined) {
        text = 'None';
    }
    text = text.toString();
    return text;
}

/*Нарисовать сегмент с задержкой*/
function drawWithDelay(delay, x, y, color, proc, middle=50) {
    setTimeout(() => {
        if (proc >= 1){
            proc = 1;
        }
        let field = document.getElementById("drawingTree");
        let ctx = field.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
        let hue_channel = middle+color*(1-proc);
        ctx.fillStyle = "hsl(" + hue_channel + ", 100%, 50%)";
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

/*Интерпретирует полученные данные дерева в удобный для чтения массив (данная функция отвечает за деревья)*/
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
/*Интерпретирует полученные данные дерева в удобный для чтения массив (данная функция отвечает за листья)*/
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

/*Создать элементы дерева и связи*/
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

/*Стереть дерево*/
function eraseTreePoints() {
    let field = document.getElementById("drawingTree");
    let ctx = field.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, field.width, field.height);
    ctx.closePath();
}

/*Нарисовать связь между началом и целью*/
function drawTreePoints(x, y, target, color, middle=50) {
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
        drawWithDelay(prev_sh/8, treePoint.x, treePoint.y, color, xF, middle);
        prev_sh += 1;
    }
}

/*Изменить размер канваса для дерева*/
function resizeTreeD() {
    let w = window.innerWidth;
    let h = (treeLevels.length+1)*0.15*window.innerHeight;
    $("#drawingTree").attr("width", w);
    $("#drawingTree").attr("height", h);
    $("#drawingTree").css({
        "height": h,
        "width": w
    });
}

function getDrawingNodes(parentId, parentLevel, type) {
    let childrens = [];
    let parent = "#state_"+parentLevel+"_val_"+parentId;
    for (let i = 0; i < treeParents[parentLevel+1].length; i++) {
        if (treeParents[parentLevel+1][i] == parentId) {
            childrens.push("#state_"+(parentLevel+1).toString()+"_val_"+i);
        }
    }
    if (type === "left") {
        return [parent, childrens[0]];
    }
    return [parent, childrens[1]];
}

function desisionDraw(data) {
    let way = data.way;
    let level = 0;
    let id = 0;
    let nextNode = undefined;
    let parent = undefined;
    for (let i = 0; i < way.length; i++) {
        let nodes = getDrawingNodes(id, level, way[i]);
        nextNode = nodes[1];
        parent = nodes[0];
        

        let x_par = ($(parent)[0].offsetLeft + parseInt($(parent).css("width"))/2)/window.innerWidth;
        let y_par = $(parent)[0].offsetTop/window.innerHeight+parseInt($(parent).css("height"))/window.innerHeight;
        let targ = [($(nextNode)[0].offsetLeft + parseInt($(nextNode).css("width"))/2)/window.innerWidth, $(nextNode)[0].offsetTop/window.innerHeight, (parseInt($(nextNode).css("height"))/2)/window.innerHeight]
        
        level += 1;
        id = parseInt(nextNode.split("_")[3]);

        setTimeout(() => {
            drawTreePoints(x_par, y_par, targ, 20, 180);
        }, 200*i);
        redrawAfterDelay(x_par, y_par, targ, treeColors[level][id], 50, 3000+200*i);
    }
}

function redrawAfterDelay(x_par, y_par, targ, color, middle, delay){
    setTimeout(() => {
        drawTreePoints(x_par, y_par, targ, color, middle);
        desisionShowing = false;
    }, delay);
}

$(document).ready(function () {
    if($("#treeBox").length === 0){
        return;
    }
    $(sendB).mousedown(async function () {
        if (inputCategory === 0){
            if (file !== undefined) {
                let formData = new FormData();
                formData.append('file', file);
    
                let response = await fetch('http://127.0.0.1:5000/make_tree?max_depth='+getDepth().toString()+'&min_samples_leaf='+getSamples().toString()+'&max_leaf_nodes='+getNodes().toString(), {
                    method: 'POST',
                    body: formData
                });
                
                data = await response.json();
            }
            
            if (data !== undefined){
                treeLevels = [];
                treeParents = [];
                eraseTreePoints();
                $("#treeBox").empty();
                enterpritateTree(data, 0);
                drawFullTree();
            }
        }else if (inputCategory === 1){
            if (!desisionShowing) {
                let response = await fetch('http://127.0.0.1:5000/get_decision?row='+getText(), {
                    method: 'GET'
                });
                console.log(response);
                data = await response.json();
                console.log(data);
                console.log(treeLevels, treeParents);
                desisionShowing = true;
                desisionDraw(data);
            }
        }
        
    });
    $('#dataset').on('change', async function(){
        file = this.files[0];
        $('.input-file-text').html(file.name);
    });
    $('#checker').on('click', function () {
        if (inputCategory === 0) {
            inputCategory = 1;
            let catOne = $(".catOne");
            for (let el = 0; el < catOne.length; el++) {
                let topNow = parseInt($(catOne[el]).css("top"))/window.innerHeight;
                $(catOne[el]).css("top", ((topNow - 0.06)*100).toString() + "vh");
            }
            let catTwo = $(".catTwo");
            for (let el = 0; el < catTwo.length; el++) {
                let topNow = parseInt($(catTwo[el]).css("top"))/window.innerHeight;
                console.log(topNow);
                $(catTwo[el]).css("top", ((topNow - 0.06)*100).toString() + "vh");
            }
            $("#piston").css("height", "100%");
            setTimeout(() => {
                $("#piston").css({
                    "height": "3vh",
                    "top": "3.01vh"
                })
            }, 300);
        }
        else if (inputCategory === 1) {
            inputCategory = 0;
            let catOne = $(".catOne");
            for (let el = 0; el < catOne.length; el++) {
                let topNow = parseInt($(catOne[el]).css("top"))/window.innerHeight;
                $(catOne[el]).css("top", ((topNow + 0.06)*100).toString() + "vh");
            }
            let catTwo = $(".catTwo");
            for (let el = 0; el < catTwo.length; el++) {
                let topNow = parseInt($(catTwo[el]).css("top"))/window.innerHeight;
                console.log(topNow);
                $(catTwo[el]).css("top", ((topNow + 0.06)*100).toString() + "vh");
            }
            $("#piston").css({
                "height": "6vh",
                "top": "-0.01vh"
            })
            
            setTimeout(() => {
                $("#piston").css("height", "50%");
            }, 300);
        }
    });
    $(depthEditor).on('change', function () {
        getDepth();
    });
    $(samplesEditor).on('change', function () {
        getSamples();
    });
    $(nodesEditor).on('change', function () {
        getNodes();
    });
    resizeTreeD();
});

$(window).resize(function () { 
    resizeTreeD();
});
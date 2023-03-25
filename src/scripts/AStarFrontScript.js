import {generateMaze} from "./mazeGenerator.js";
import {aStarPathfinding} from "./aStarAlgo.js";
import * as $ from "./jQueryAStarFront.js";

var prev_n = 0;

let global_matrix;
let enumerate = false;

function toId(x, y) {
    return "#cell_" + x.toString() + "_" + y.toString();
}

$(document).ready(function () {
    console.log("hello!");
    $("#maze_subm").mousedown(function () {
        let n = ($("#n_number").val()-1)*2 + 1;
        if (n > 10001){
            n = 10001;
            $("#n_number").val(n);
        }
        if (n < 3){
            n = 3;
            $("#n_number").val(n);
        }
        var proc_f = 87/n;
        var proc_b = proc_f/5;
        var margin_new = proc_f*0.025;
        proc_f = proc_f*0.95;
        let proc_f_s = proc_f.toString()+"vh";
        let proc_b_s = proc_b.toString()+"vh";
        let marg_s = margin_new.toString()+"vh";
        let maze = generateMaze((n-1)/2 + 1).maze;
        let matrix = new Array(n);
        if (prev_n <= n){
            for (let y = 0; y < n; y++) {
                matrix[y] = new Array(n);
                for (let x = 0; x < n; x++) {
                    console.log(x+1, y+1);
                    matrix[y][x] = maze[y+1][x+1];
                    setTimeout(() => {
                        let idE = "cell_" + x.toString() + "_" + y.toString();
                        if ($("#"+idE).length == 0){
                            let his_cl = "matrix_el_" + matrix[y][x].toString();
                            if ((x+y)%2 != 1){
                                if (y%2 != 1){
                                    his_cl = "matrix_el_" + matrix[y][x].toString() + "_box";
                                }else{
                                    his_cl = "matrix_el_0_none";
                                }
                            }
                            
                            if (his_cl != "matrix_el_0_none"){
                                let new_el = "<div class='" + his_cl + "' id='" + idE + "' style='position:inherit;'></div>";
                                $(new_el).appendTo("#matrix_box");
                            }
                        }
                        else{
                            let myClass = $("#"+idE).attr("class");
                            const cl_el = myClass.split("_");
                            let his_cl = "matrix_el_" + matrix[y][x].toString();
                            if ((x+y)%2 != 1){
                                if (y%2 != 1){
                                    his_cl = "matrix_el_" + matrix[y][x].toString() + "_box";
                                }else{
                                    his_cl = "matrix_el_0_none";
                                }
                            }
                            $("#"+idE).removeClass(myClass);
                            $("#"+idE).addClass(his_cl);
                        }
                        $("#"+idE).css({
                            width: proc_f_s,
                            height: proc_f_s,
                            margin: marg_s,
                            left: (0.5+x * (proc_f/0.95)).toString() + "vh",
                            top: (0.5+y * (proc_f/0.95)).toString() + "vh",
                            "border-radius": proc_b_s,
                        });
                    }, (x*y));
                }
            }
            prev_n = n;
        }
        else if (prev_n > n){
            for (let y = prev_n-1; y >= 0; y--) {
                for (let x = prev_n-1; x >= 0; x--) {
                    if (x >= n || y >= n){
                        setTimeout(() => {
                            let el = "#cell_" + x.toString() + "_" + y.toString();
                            $(el).css("width", 0);
                            $(el).css("height", 0);
                            $(el).remove();
                        }, (prev_n-x)*(prev_n-y));
                    }
                }
            }
            for (let y = n-1; y >= 0; y--) {
                matrix[y] = new Array(n);
                for (let x = n-1; x >= 0; x--) {
                    matrix[y][x] = maze[y+1][x+1]
                    setTimeout(() => {
                        let idE = "cell_" + x.toString() + "_" + y.toString();
                        if ($("#"+idE).length == 0){
                            let his_cl = "matrix_el_" + matrix[y][x].toString();
                            if ((x+y)%2 != 1){
                                if (y%2 != 1){
                                    his_cl = "matrix_el_" + matrix[y][x].toString() + "_box";
                                }else{
                                    his_cl = "matrix_el_0_none";
                                }
                            }
                            
                            if (his_cl != "matrix_el_0_none"){
                                let new_el = "<div class='" + his_cl + "' id='" + idE + "' style='position:inherit;'></div>";
                                $(new_el).appendTo("#matrix_box");
                            }
                        }
                        else{
                            let myClass = $("#"+idE).attr("class");
                            const cl_el = myClass.split("_");
                            let his_cl = "matrix_el_" + matrix[y][x].toString();
                            if ((x+y)%2 != 1){
                                if (y%2 != 1){
                                    his_cl = "matrix_el_" + matrix[y][x].toString() + "_box";
                                }else{
                                    his_cl = "matrix_el_0_none";
                                }
                            }
                            $("#"+idE).removeClass(myClass);
                            $("#"+idE).addClass(his_cl);
                        }
                        $("#"+idE).css({
                            width: proc_f_s,
                            height: proc_f_s,
                            margin: marg_s,
                            left: (0.5+x * (proc_f/0.95)).toString() + "vh",
                            top: (0.5+y * (proc_f/0.95)).toString() + "vh",
                            "border-radius": proc_b_s,
                        });
                    }, (prev_n-x)*(prev_n-y));
                }
            }
            prev_n = n;
        }
        global_matrix = matrix;
    });
    $("#create_subm").mousedown(function () {
        let n = ($("#n_number").val()-1)*2 + 1;
        if (n > 10001){
            n = 10001;
            $("#n_number").val(n);
        }
        if (n < 1){
            n = 1;
            $("#n_number").val(n);
        }
        console.log(n, prev_n);
        var proc_f = 87/n;
        var proc_b = proc_f/5;
        var margin_new = proc_f*0.025;
        proc_f = proc_f*0.95;
        let proc_f_s = proc_f.toString()+"vh";
        let proc_b_s = proc_b.toString()+"vh";
        let marg_s = margin_new.toString()+"vh";
        let matrix = new Array(n);
        if (prev_n <= n){
            console.log(n, prev_n);
            for (let y = 0; y < n; y++) {
                matrix[y] = new Array(n);
                for (let x = 0; x < n; x++) {
                    setTimeout(() => {
                        let idE = "cell_" + x.toString() + "_" + y.toString();
                        if ($("#"+idE).length == 0){
                            let his_cl = "matrix_el_1"
                            if ((x+y)%2 != 1){
                                if (y%2 != 1){
                                    his_cl = "matrix_el_1_box"
                                    matrix[y][x] = 1;
                                }else{
                                    his_cl = "matrix_el_0_none"
                                    matrix[y][x] = 0;
                                }
                            }else{
                                matrix[y][x] = 1;
                            }
                            
                            if (his_cl != "matrix_el_0_none"){
                                let new_el = "<div class='" + his_cl + "' id='" + idE + "' style='position:inherit;'></div>";
                                $(new_el).appendTo("#matrix_box");
                            }
                        }
                        else{
                            let myClass = $("#"+idE).attr("class");
                            const cl_el = myClass.split("_");
                            matrix[y][x] = parseInt(cl_el[2]);
                        }
                        $("#"+idE).css({
                            width: proc_f_s,
                            height: proc_f_s,
                            margin: marg_s,
                            left: (0.5+x * (proc_f/0.95)).toString() + "vh",
                            top: (0.5+y * (proc_f/0.95)).toString() + "vh",
                            "border-radius": proc_b_s,
                        });
                    }, (x*y));
                }
            }
            prev_n = n;
        }
        else if (prev_n > n){
            for (let y = prev_n-1; y >= 0; y--) {
                matrix[y] = new Array(n);
                for (let x = prev_n-1; x >= 0; x--) {
                    if (x >= n || y >= n){
                        setTimeout(() => {
                            let el = "#cell_" + x.toString() + "_" + y.toString();
                            $(el).css("width", 0);
                            $(el).css("height", 0);
                            $(el).remove();
                        }, (prev_n-x)*(prev_n-y));
                    }
                    else{
                        setTimeout(() => {
                            let el = "#cell_" + x.toString() + "_" + y.toString();
                            if ($(el).length){
                                let myClass = $(el).attr("class");
                                const cl_el = myClass.split("_");
                                matrix[y][x] = parseInt(cl_el[2]);
                            }
                            $(el).css({
                                width: proc_f_s,
                                height: proc_f_s,
                                margin: marg_s,
                                left: (0.5+x * (proc_f/0.95)).toString() + "vh",
                                top: (0.5+y * (proc_f/0.95)).toString() + "vh",
                                "border-radius": proc_b_s,
                            });
                        }, (prev_n-x)*(prev_n-y));
                    }
                }
            }
            prev_n = n;
        }
        global_matrix = matrix;
    });
    $("#clear_subm").mousedown(function () {
        for (let y = 0; y < prev_n; y++) {
            for (let x = 0; x < prev_n; x++) {
                setTimeout(() => {
                    let idE = "cell_" + x.toString() + "_" + y.toString();
                    let myclass = $("#"+idE).attr("class");
                    let his_cl = "matrix_el_1"
                    if ((x+y)%2 != 1){
                        if (y%2 != 1){
                            his_cl = "matrix_el_1_box"
                            global_matrix[y][x] = 1;
                        }else{
                            his_cl = "matrix_el_0_none"
                        }
                    }else{
                        global_matrix[y][x] = 1;
                    }
                    
                    if (his_cl != "matrix_el_0_none"){
                        $("#"+idE).removeClass(myclass);
                        $("#"+idE).addClass(his_cl);
                    }
                }, (x*y));
            }
        }
    });
    $("#solution_subm").mousedown(function() {
        if (global_matrix.length > 0){
            $(this).css("display", "none");
            $("#create_subm").css("display", "none");
            $("#maze_subm").css("display", "none");
            $("#enum_switch").css("display", "none");
            $("#clear_subm").css("display", "none");
            let maze = new Array(prev_n+2);
            for (let y = 0; y < prev_n+2; y++){
                maze[y] = new Array(prev_n+2);
                for (let x = 0; x < prev_n+2; x++){
                    if (x == 0 || x == prev_n+1 || y == 0 || y == prev_n+1){
                        maze[y][x] = 0;
                    }
                    else{
                        maze[y][x] = global_matrix[y-1][x-1];
                    }
                }
            }
            let res = aStarPathfinding(maze);
            let wandering = res.wandering;
            let path = res.goodPath;
            let prev_y = wandering[0][0];
            let prev_x = wandering[0][1];
            let el = toId(prev_x, prev_y);
            for (let i=0; i<wandering.length; i++){
                setTimeout(() => {
                    let new_y = wandering[i][0] - 1;
                    let new_x = wandering[i][1] - 1;
                    let el = toId(new_x, new_y);
                    $(el).addClass("vsited");
                }, parseInt(2000/wandering.length)*i);
                setTimeout(() => {
                    let new_y = wandering[i][0] - 1;
                    let new_x = wandering[i][1] - 1;
                    el = toId(new_x, new_y);
                    $(el).removeClass("vsited");
                }, parseInt(2000/wandering.length)*i+100);
                prev_y = wandering[i][0] - 1;
                prev_x = wandering[i][1] - 1;
            }
            let wait = 7100;
            if (path.length < 1){
                wait = 2100;
            }
            for (let i=0; i<path.length; i++){
                setTimeout(() => {
                    let new_y = path[i][0] - 1;
                    let new_x = path[i][1] - 1;
                    let el = toId(new_x, new_y);
                    $(el).addClass("goodF");
                }, parseInt(1000/wandering.length)*i+2100);
                setTimeout(() => {
                    let new_y = path[i][0] - 1;
                    let new_x = path[i][1] - 1;
                    let el = toId(new_x, new_y);
                    $(el).removeClass("goodF");
                    $(el).addClass("good");

                    if(enumerate){
                        $(el).text(i+1);
                        let hght = parseFloat($(el).css("height"));
                        let k = 1;
                        while (10**k < i) {
                            k += 1
                        }
                        hght = hght/(1.15**k);
                        $(el).css("font-size", hght);
                    }
                }, parseInt(1000/wandering.length)*i+2200);
                setTimeout(() => {
                    let new_y = path[i][0] - 1;
                    let new_x = path[i][1] - 1;
                    let el = toId(new_x, new_y);
                    $(el).removeClass("good");
                    if (enumerate){
                        $(el).text("");
                    }
                }, parseInt(1000/wandering.length)*i+6250);
                prev_y = wandering[i][0] - 1;
                prev_x = wandering[i][1] - 1;
            }
            setTimeout(() => {
                $(this).css("display", "block");
                $("#create_subm").css("display", "block");
                $("#maze_subm").css("display", "block");
                $("#enum_switch").css("display", "block");
                $("#clear_subm").css("display", "block");
            }, wait);
        }
    });
    $("#enum_switch").mousedown(function () { 
        if (enumerate){
            $(this).removeClass("true");
            $(this).addClass("false");
            enumerate = false;
        }
        else{
            $(this).removeClass("false");
            $(this).addClass("true");
            enumerate = true;
        }
    });
});

$(document).on("click", ".matrix_el_1", function () { 
    const ids = $(this).attr("id").split("_");
    let x = parseInt(ids[1]);
    let y = parseInt(ids[2]);
    global_matrix[y][x] = 0;
    console.log(global_matrix);
    console.log(global_matrix[y][x])
    $(this).removeClass("matrix_el_1");
    $(this).addClass("matrix_el_0");
});
$(document).on("click", ".matrix_el_0", function () { 
    const ids = $(this).attr("id").split("_");
    let x = parseInt(ids[1]);
    let y = parseInt(ids[2]);
    global_matrix[y][x] = 1;
    console.log(global_matrix);
    console.log(global_matrix[y][x])
    $(this).removeClass("matrix_el_0");
    $(this).addClass("matrix_el_1");
});


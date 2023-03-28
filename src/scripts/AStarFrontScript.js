//Импорт отдельных функций из нужных модулей
import {generateMaze} from "./mazeGenerator.js";
import {aStarPathfinding} from "./aStarAlgo.js";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let prev_n = 0;

let global_matrix;
let enumerate = false;
let mouseClicked = false;
let pathStartClicked = false;
let pathEndClicked = false;

let load_names = ["zero", "very low", "low", "medium",
                  "high", "very high", "ultra high",
                  "crazy", "computer death"];
let load_diff = [0, 1, 10, 25, 40, 55, 90, 150, 400]
let load_colors = ["rgb(0, 0, 0)", "rgb(0, 232, 182)", "rgb(0, 232, 31)",
                   "rgb(182, 232, 0)", "rgb(232, 209, 0)", "rgb(232, 66, 0)",
                   "rgb(232, 0, 0)", "rgb(200, 0, 0)", "rgb(150, 0, 0)"]

/*возвращает id блока на позиции [x, y]*/
function toId(x, y) {
    return "#cell_" + x.toString() + "_" + y.toString();
}

/*перезагружает позиции и размеры блоков начала и конца пути*/
function end_start_reload(n){
    let proc_f = 87 / n;
    let proc_b = proc_f / 5;
    let margin_new = proc_f * 0.025;
    proc_f = proc_f * 0.95;
    let proc_b_s = proc_b.toString() + "vh";
    let marg_s = margin_new.toString() + "vh";

    let pathStart = $("#path_start");
    let pathEnd = $("#path_end");

    let start_pos = pathStart.attr("class").split(" ")[1].split("_");
    let end_pos = pathEnd.attr("class").split(" ")[1].split("_");
    start_pos[0] = parseInt(start_pos[0]);
    start_pos[1] = parseInt(start_pos[1]);
    end_pos[0] = parseInt(end_pos[0]);
    end_pos[1] = parseInt(end_pos[1]);
    pathStart.removeClass(start_pos[0].toString() + "_" + start_pos[1].toString());
    pathEnd.removeClass(end_pos[0].toString() + "_" + end_pos[1].toString());

    if (start_pos[0] === -1){
        start_pos[0] = 0;
        start_pos[1] = 0;
    }
    if (end_pos[0] === -1){
        end_pos[0] = n-1;
        end_pos[1] = n-1;
    }
    let timeWaitStart = start_pos[0] * start_pos[1];
    let timeWaitEnd = end_pos[0] * end_pos[1];
    if (prev_n > n){
        timeWaitStart = (prev_n-start_pos[0]) * (prev_n-start_pos[1]);
        timeWaitEnd = (prev_n-end_pos[0]) * (prev_n-end_pos[1]);
    }

    setTimeout(() => {
        $("#path_start").css({
            width: (proc_f * 0.9).toString() + "vh",
            height: (proc_f * 0.9).toString() + "vh",
            margin: marg_s,
            left: (0.5 + start_pos[0] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
            top: (0.5 + start_pos[1] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
            transition: "background 0.5s, border-radius 0s, top 1s, left 1s, height 1s, width 1s",
            "border-radius": proc_b_s,
        });
    }, timeWaitStart);
    setTimeout(() => {
        $("#path_end").css({
            width: (proc_f * 0.9).toString() + "vh",
            height: (proc_f * 0.9).toString() + "vh",
            margin: marg_s,
            left: (0.5 + end_pos[0] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
            top: (0.5 + end_pos[1] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
            transition: "background 0.5s, border-radius 0s, top 1s, left 1s, height 1s, width 1s",
            "border-radius": proc_b_s,
        });
    }, timeWaitEnd);
    
    if (start_pos[0] >= n){
        start_pos[0] = n - 1;
    }
    if (start_pos[1] >= n){
        start_pos[1] = n - 1;
    }
    
    if (end_pos[0] >= n){
        end_pos[0] = n - 1;
    }
    if (end_pos[1] >= n){
        end_pos[1] = n - 1;
    }

    pathStart.addClass(start_pos[0].toString() + "_" + start_pos[1].toString());
    pathEnd.addClass(end_pos[0].toString() + "_" + end_pos[1].toString());
}

/*возвращает выбранный юзером n*/
function get_num() {
    let nNum = $("#n_number");
    let n = (nNum.val() - 1) * 2 + 1;
    if (n > 10001){
        n = 10001;
        nNum.val(n);
    }
    if (n < 3){
        n = 3;
        nNum.val(n);
    }
    return n;
}

/*изменяет блоки под информацию из матрицы при параметре type: as_matrix
дополняет и заполняет матрицу пустотой при параметре type: to_matrix*/
function element_load_matrix(el, my_matrix, x, y, n, type) {
    let idE = el.split("#")[1];
    if (my_matrix[y][x] === undefined){
        my_matrix[y][x] = 1;
    }

    let id_add = "1";
    if (type === "as_matrix"){
        id_add = my_matrix[y][x].toString();
    }

    if ($(el).length === 0){
        let his_cl = "matrix_el_" + id_add;
        if ((x+y)%2 !== 1){
            if (y%2 !== 1){
                his_cl = "matrix_el_" + id_add + "_box";
            }else{
                his_cl = "matrix_el_0_none";
                my_matrix[y][x] = 0;
            }
        }
        
        if (his_cl !== "matrix_el_0_none"){
            let new_el = "<div class='" + his_cl + "' id='" + idE + "' style='position:inherit;'></div>";
            $(new_el).appendTo("#matrix_box");
        }
    }
    else{
        id_add = my_matrix[y][x].toString();
        let myClass = $(el).attr("class");
        let his_cl = "matrix_el_" + id_add;
        if ((x+y)%2 !== 1){
            if (y%2 !== 1){
                his_cl = "matrix_el_" + id_add + "_box";
            }else{
                his_cl = "matrix_el_0_none";
            }
        }
        $(el).removeClass(myClass);
        $(el).addClass(his_cl);
    }
    block_position_front_reload(x, y, n);
    return my_matrix[y][x];
}

/*возвращает валидное значение позиции*/
function check_block_pos(pos){
    if (pos[0] === -1){
        pos[0] = 0;
        pos[1] = 0;
    }
    if (pos[0] >= prev_n){
        pos[0] = prev_n - 1;
    }
    if (pos[1] >= prev_n){
        pos[1] = prev_n - 1;
    }
    return pos;
}

/*возвращает координаты блока, где находится мышь*/
function get_mouse_block(e){
    let mPosX = e.originalEvent.clientX;
    let mPosY = e.originalEvent.clientY;

    let matrixBox = $("#matrix_box");

    let matrix_el_x = parseInt(matrixBox.css("left").split("px")[0]);
    let matrix_el_y = parseInt(matrixBox.css("top").split("px")[0]) + parseInt($("#container").css("top").split("px")[0]);

    let oneH = $(document).height()/100;
    matrix_el_x += oneH;
    matrix_el_y += oneH;

    let mouseBlockX = parseInt((mPosX - matrix_el_x + oneH * 0.25 * (87 / (prev_n / 2))) /
                                (oneH * (87 / (prev_n / 2)))) * 2;
    let mouseBlockY = parseInt((mPosY - matrix_el_y + oneH * 0.25 * (87 / (prev_n / 2))) /
                                (oneH * (87 / (prev_n / 2)))) * 2;

    if (mouseBlockX < 0){
        mouseBlockX = 0;
    }
    if (mouseBlockX > prev_n - 1){
        mouseBlockX = prev_n - 1;
    }
    
    if (mouseBlockY < 0){
        mouseBlockY = 0;
    }
    if (mouseBlockY > prev_n - 1){
        mouseBlockY = prev_n - 1;
    }
    return [mouseBlockX, mouseBlockY];
}

/*генерирует массив в формате лабиринта по данной матрице*/
function create_maze_by_mat(my_matrix){
    let maze = new Array(prev_n + 2);
    for (let y = 0; y < prev_n + 2; y++){
        maze[y] = new Array(prev_n + 2);
        for (let x = 0; x < prev_n + 2; x++){
            if (x === 0 || x === prev_n+1 || y === 0 || y === prev_n+1){
                maze[y][x] = 0;
            }
            else{
                maze[y][x] = my_matrix[y-1][x-1];
            }
        }
    }
    return maze;
}

/*анимация для блоков начала и конца пути*/
function reset_front_pos_lock(element, mousePos) {
    let new_class_added = mousePos[0].toString() + "_" + mousePos[1].toString();
    let el = "#path_" + element;

    let myClasses = $(el).attr("class").split(" ");
    myClasses[1] = new_class_added;
    $(el).attr("class", myClasses[0] + " " + myClasses[1]);

    let proc_f = 87 / prev_n;
    proc_f = proc_f * 0.95;

    $(el).css({
        transition: "background 0.5s, border-radius 0s, top 0.2s, left 0.2s, height 1s, width 1s",
    });
    $(el).css({
        width: (proc_f * 0.9).toString() + "vh",
        height: (proc_f * 0.9).toString() + "vh",
        left: (0.5 + mousePos[0] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
        top: (0.5 + mousePos[1] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
    });
    setTimeout(() => {
        $(el).css({
            transition: "background 0.5s, border-radius 0s, top 1s, left 1s, height 1s, width 1s",
        });
    }, 200);
}

/*краска поиска*/
function yellow_coloring(el, timing){
    setTimeout(() => {
        $(el).addClass("vsited");
    }, timing);
    setTimeout(() => {
        $(el).removeClass("vsited");
    }, timing + 100);
}

/*краска найденного пути*/
function path_coloring(el, timing, num) {
    setTimeout(() => {
        $(el).addClass("goodF");
    }, timing);
    setTimeout(() => {
        $(el).removeClass("goodF");
        $(el).addClass("good");

        if(enumerate){
            $(el).text(num+1);
            let hght = parseFloat($(el).css("height"));
            let k = 1;
            while (10 ** k < num) {
                k += 1
            }
            hght = hght / (1.15 ** k);
            $(el).css("font-size", hght);
        }
    }, timing + 200);
    setTimeout(() => {
        $(el).removeClass("good");
        if (enumerate){
            $(el).text("");
        }
    }, timing + 3200);
}

/*краска неудачной попытки поиска*/
function red_coloring(el, timing) {
    setTimeout(() => {
        $(el).addClass("vsited");
        $(el).addClass("unfinded");
    }, timing);
    setTimeout(() => {
        $(el).removeClass("vsited");
        $(el).removeClass("unfinded");
    }, timing + 3100);
}

/*сокращает слишком большие задержки начала анимации между соседними блоками*/
function calculate_display_animation(x, y){
    
    let default_time = x*y;
    let prev_time_type_1 = (x - 1) * y;
    let prev_time_type_2 = (y - 1) * x;
    let prev_time_max = prev_time_type_1;
    if (prev_time_type_2 < prev_time_type_1){
        prev_time_max = prev_time_type_2;
    }
    if (default_time - prev_time_max >= 10){
        default_time = prev_time_max + 10;
    }
    return default_time;
}

/*анимирует перемещение блоков*/
function block_position_front_reload(x, y, n){
    let proc_f = 87 / n;
    let proc_b = proc_f / 5;
    let margin_new = proc_f * 0.025;
    proc_f = proc_f * 0.95;
    let proc_f_s = proc_f.toString()+"vh";
    let proc_b_s = proc_b.toString()+"vh";
    let marg_s = margin_new.toString()+"vh";

    let el = toId(x, y);
    
    $(el).css({
        width: proc_f_s,
        height: proc_f_s,
        margin: marg_s,
        left: (0.5 + x * (proc_f / 0.95)).toString() + "vh",
        top: (0.5 + y * (proc_f / 0.95)).toString() + "vh",
        "border-radius": proc_b_s,
    });
}

/*слушает нажатия на кликабельные div-ы*/
$(document).ready(function () {
    /*создать матрицу-лабиринт*/
    $("#maze_subm").mousedown(function () {
        let n = get_num();
        let maze = generateMaze((n - 1) / 2 + 1).maze;
        let matrix = new Array(n);
        end_start_reload(n);

        if (prev_n <= n){
            for (let y = 0; y < n; y++) {
                matrix[y] = new Array(n);
                for (let x = 0; x < n; x++) {
                    matrix[y][x] = maze[y + 1][x + 1];
                    setTimeout(() => {
                        let el = toId(x, y);
                        element_load_matrix(el, matrix, x, y, n, "as_matrix");
                    }, calculate_display_animation(x, y));
                }
            }
            prev_n = n;
        }
        else if (prev_n > n){
            for (let y = prev_n - 1; y >= 0; y--) {
                for (let x = prev_n - 1; x >= 0; x--) {
                    if (x >= n || y >= n){
                        setTimeout(() => {
                            let el = toId(x, y);
                            $(el).remove();
                        }, calculate_display_animation(prev_n - x, prev_n - y));
                    }
                }
            }
            for (let y = n - 1; y >= 0; y--) {
                matrix[y] = new Array(n);
                for (let x = n - 1; x >= 0; x--) {
                    matrix[y][x] = maze[y + 1][x + 1]
                    setTimeout(() => {
                        let el = toId(x, y);
                        element_load_matrix(el, matrix, x, y, n, "as_matrix");
                    }, calculate_display_animation(prev_n - x, prev_n - y));
                }
            }
            prev_n = n;
        }
        
        global_matrix = matrix;
    });
    /*создать чистую матрицу*/
    $("#create_subm").mousedown(function () {
        let n = get_num();
        
        let matrix = new Array(n);

        end_start_reload(n);

        if (prev_n <= n){
            for (let y = 0; y < n; y++) {
                matrix[y] = new Array(n);
                for (let x = 0; x < n; x++) {
                    setTimeout(() => {
                        let el = toId(x, y);
                        matrix[y][x] = element_load_matrix(el, matrix, x, y, n, "to_matrix");
                    }, calculate_display_animation(x, y));
                }
            }
            prev_n = n;
        }
        else if (prev_n > n){
            for (let y = prev_n - 1; y >= 0; y--) {
                matrix[y] = new Array(n);
                for (let x = prev_n - 1; x >= 0; x--) {
                    if (x >= n || y >= n){
                        setTimeout(() => {
                            let el = toId(x, y);
                            $(el).remove();
                        }, calculate_display_animation(prev_n - x, prev_n - y));
                    }
                    else{
                        setTimeout(() => {
                            let el = toId(x, y);
                            if ($().length){
                                let myClass = $(el).attr("class");
                                const cl_el = myClass.split("_");
                                matrix[y][x] = parseInt(cl_el[2]);
                            }
                            block_position_front_reload(x, y, n);
                        }, calculate_display_animation(prev_n - x, prev_n - y));
                    }
                }
            }
            prev_n = n;
        }
        global_matrix = matrix;
    });
    /*показать решение матрицы*/
    $("#solution_subm").mousedown(function() {
        if (global_matrix === undefined){
            return;
        }
        if (global_matrix.length > 0){
            $(this).css("display", "none");
            $("#create_subm").css("display", "none");
            $("#maze_subm").css("display", "none");
            $("#enum_switch").css("display", "none");
            $("#clear_subm").css("display", "none");
            
            let maze = create_maze_by_mat(global_matrix);

            let start_pos = $("#path_start").attr("class").split(" ")[1].split("_");
            let end_pos = $("#path_end").attr("class").split(" ")[1].split("_");
            start_pos[0] = parseInt(start_pos[0]);
            start_pos[1] = parseInt(start_pos[1]);
            end_pos[0] = parseInt(end_pos[0]);
            end_pos[1] = parseInt(end_pos[1]);

            start_pos = check_block_pos(start_pos);
            end_pos = check_block_pos(end_pos);

            let start_point = [start_pos[1]+1, start_pos[0]+1];
            let end_point = [end_pos[1]+1, end_pos[0]+1];

            let res = aStarPathfinding(maze, start_point, end_point);
            let wandering = res.wandering;
            let path = res.goodPath;

            let total_time_for_yellow = 2000 * parseInt(1 + wandering.length / 1000);
            let total_time_wor_red = parseInt(total_time_for_yellow / 2);
            let total_time_for_green = 1000 * parseInt(1 + path.length / 1000);

            for (let i = 0; i < wandering.length; i++){
                let new_y = wandering[i][0] - 1;
                let new_x = wandering[i][1] - 1;
                let el = toId(new_x, new_y);
                yellow_coloring(el, parseInt(total_time_for_yellow / wandering.length) * i);
            }
            if (path.length > 0){
                for (let i=0; i<path.length; i++){
                    let new_y = path[i][0] - 1;
                    let new_x = path[i][1] - 1;
                    let el = toId(new_x, new_y);
                    path_coloring(el, parseInt(total_time_for_green / wandering.length) *
                                                        i + (total_time_for_yellow+100), i);
                }
            }
            else{
                for (let i=0; i<wandering.length; i++){
                    let new_y = wandering[i][0] - 1;
                    let new_x = wandering[i][1] - 1;
                    let el = toId(new_x, new_y);
                    red_coloring(el, parseInt(total_time_wor_red / wandering.length) *
                                                        i + (total_time_for_yellow + 100));
                }
            }
            
            setTimeout(() => {
                $(this).css("display", "block");
                $("#create_subm").css("display", "block");
                $("#maze_subm").css("display", "block");
                $("#enum_switch").css("display", "block");
                $("#clear_subm").css("display", "block");
            }, total_time_for_yellow + total_time_wor_red + total_time_for_green + 3000);
        }
    });
    /*изменить режим нумерации пути*/
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
    /*обработка нажатия на стартовый блок*/
    $("#path_start").mousedown(function () {
        pathStartClicked = true;
    });
    /*обработка нажатия на конечный блок*/
    $("#path_end").mousedown(function () {
        pathEndClicked = true;
    });
    /*обработка изменения в инпуте*/
    $("#n_number").change(function () {
        let n = get_num();
        let d_i = 0;
        while (d_i < load_diff.length && load_diff[d_i] < n){
            d_i += 1
            if (d_i >= load_diff.length){
                d_i -= 1;
                break;
            }else if (load_diff[d_i] > n){
                d_i -= 1;
                break;
            }
        }
        let loadInfo = $("#load_difficulty_info");

        loadInfo.text(load_names[d_i]);
        loadInfo.css("color", load_colors[d_i]);
    });
    /*включение анимации заднего фона*/
    background_animation();
});

/*создать стену*/
$(document).on("click", ".matrix_el_1", function () { 
    const ids = $(this).attr("id").split("_");
    let x = parseInt(ids[1]);
    let y = parseInt(ids[2]);
    global_matrix[y][x] = 0;
    $(this).removeClass("matrix_el_1");
    $(this).addClass("matrix_el_0");
});
/*удалить стену*/
$(document).on("click", ".matrix_el_0", function () { 
    const ids = $(this).attr("id").split("_");
    let x = parseInt(ids[1]);
    let y = parseInt(ids[2]);
    global_matrix[y][x] = 1;
    $(this).removeClass("matrix_el_0");
    $(this).addClass("matrix_el_1");
});

/*мышка зажата*/
$(document).mousedown(function () {
    mouseClicked = true;
});
/*мышка отжата*/
$(document).mouseup(function (e) {
    mouseClicked = false;
    
    if (pathStartClicked){
        pathStartClicked = false;

        reset_front_pos_lock("start", get_mouse_block(e));
    }
    else if (pathEndClicked){
        pathEndClicked = false;

        reset_front_pos_lock("end", get_mouse_block(e));
    }
});
/*перемещение мыши*/
$(document).mousemove(function (e) {
    if (mouseClicked){
        let mousePos = get_mouse_block(e);

        let proc_f = 87 / prev_n;
        proc_f = proc_f * 0.95;
        
        if (pathStartClicked){
            $("#path_start").css({
                left:(0.5 + mousePos[0] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
                top: (0.5 + mousePos[1] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
                transition: "background 0.5s, border-radius 0s, top 0.2s, left 0.2s, height 1s, width 1s",
            });
        }
        else if (pathEndClicked){
            $("#path_end").css({
                left:(0.5 + mousePos[0] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
                top: (0.5 + mousePos[1] * (proc_f / 0.95) + proc_f * 0.05).toString() + "vh",
                transition: "background 0.5s, border-radius 0s, top 0.2s, left 0.2s, height 1s, width 1s",
            });
        }
    }
});

/*анимация заднего фона*/
function background_animation() {
    for (let i = 0; i < 30; i++){
        let win_h = $(document).height();
        let win_w = $(document).width();

        let matrixBox = $("#matrix_box");
        let block = "#mov_box_" + i.toString();

        if (Math.random() > 0.97 && matrixBox.length){
            let new_size = Math.random() * (win_h / 8);
            if (new_size <= 50){
                new_size = 50;
            }
            let border_rad = new_size / 5;

            let x_block_start = parseInt(matrixBox.css("left").split("px")[0])-new_size;
            let mat_w = parseInt(matrixBox.css("width").split("px")[0]);

            let new_xp = Math.random() * (win_w - mat_w - new_size);
            
            if (new_xp >= x_block_start + new_size){
                new_xp += mat_w;
            }
            
            let new_yp = Math.random()*(win_h - new_size);

            $(block).css({
                "width": new_size.toString() + "px",
                "height": new_size.toString() + "px",
                "left": new_xp.toString() + "px",
                "top": new_yp.toString() + "px",
                "border-radius": border_rad.toString() + "px"
            });
        }
    }
    setTimeout(() => {
        background_animation();
    }, 800);
}
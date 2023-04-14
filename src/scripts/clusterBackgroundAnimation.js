function mainAnimation(width, height, canvas) {
    let circle = getCircle(width, height, Math.random() * (16 - 6) + 6);
    drawBackCircle(circle, canvas);
    setTimeout(() => {
        mainAnimation(width, height, canvas);
    }, Math.random()*2500 + 500);
}

function drawWithDelay(circle, canvas, delay, color, g) {
    setTimeout(() => {
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        let x_dir = 1;
        let y_dir = 1;
        if (circle.dots[0].x < circle.center[0]){
            x_dir = -1;
        }
        if (circle.dots[0].y < circle.center[1]){
            y_dir = -1;
        }
        ctx.moveTo(Math.abs(circle.dots[0].x-circle.center[0])*(g/300)*x_dir + circle.center[0], Math.abs(circle.dots[0].y-circle.center[1])*(g/300)*y_dir + circle.center[1]);
        for (let i = 1; i < circle.dots.length; i++) {
            let x_dir = 1;
            let y_dir = 1;
            if (circle.dots[i].x < circle.center[0]){
                x_dir = -1;
            }
            if (circle.dots[i].y < circle.center[1]){
                y_dir = -1;
            }
            ctx.lineTo(Math.abs(circle.dots[i].x-circle.center[0])*(g/300)*x_dir + circle.center[0], Math.abs(circle.dots[i].y-circle.center[1])*(g/300)*y_dir + circle.center[1]);
        }
        x_dir = 1;
        y_dir = 1;
        if (circle.dots[0].x < circle.center[0]){
            x_dir = -1;
        }
        if (circle.dots[0].y < circle.center[1]){
            y_dir = -1;
        }
        ctx.lineTo(Math.abs(circle.dots[0].x-circle.center[0])*(g/300)*x_dir + circle.center[0], Math.abs(circle.dots[0].y-circle.center[1])*(g/300)*y_dir + circle.center[1]);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }, delay);
}

function drawBackCircle(circle, canvas) {
    let color = 'hsl(' + (parseInt(Math.random() * 360)) + ',100%,50%)';
    for (let g = 1; g <= 300; g++){
        drawWithDelay(circle, canvas, g*5, color, g);
    }
}

function getCircle(width, height, gones) {
    if (gones%2 == 1) {
        gones = parseInt(gones/2)*2;
    }
    let circle = {dots: [], center: [Math.random()*width, Math.random()*height]};
    let radius = (Math.random()+0.1)*width/6;
    let start_dots = [];
    let end_dots = [];
    for (let n = 0; n < gones/2; n++) {
        let x_disp = n - gones/4;
        let x_pos = radius*(x_disp/(gones/4));
        let y_pos_top = circle.center[1] + x_pos*(Math.tan(Math.acos(Math.abs(x_pos)/radius)));
        let y_pos_bottom = circle.center[1] - x_pos*(Math.tan(Math.acos(Math.abs(x_pos)/radius)));
        if (y_pos_bottom > y_pos_top){
            let copy = y_pos_top;
            y_pos_top = y_pos_bottom;
            y_pos_bottom = copy;
        }
        let newDot_top = {x: circle.center[0] + x_pos + Math.random()*(radius/3)-radius/6, y: y_pos_top + Math.random()*(radius/3)-radius/6};
        let newDot_bot = {x: circle.center[0] + x_pos + Math.random()*(radius/3)-radius/6, y: y_pos_bottom + Math.random()*(radius/3)-radius/6};
        start_dots.push(newDot_top);
        end_dots.push(newDot_bot);
    }
    circle.dots = start_dots;
    for (let i = end_dots.length-1; i >= 0; i--) {
        if (circle.dots[0].x !== end_dots[i].x || circle.dots[0].y !== end_dots[i].y){
            circle.dots.push(end_dots[i]);
        }
    }
    return circle;
}

export {mainAnimation}
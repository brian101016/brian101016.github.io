function random_range(_min, _max) {
    //let _num = Math.random();
    //_num = Math.round(100*_num);
    
    let _diff = _max - _min;
    return Math.round(_min + (_diff * Math.random()) )
}

//###############################################################################################################
//###############################################################################################################

function boundaries(_min, _value, _max) {
    
    if(_value < _min) return _min;
    if(_value > _max) return _max;
    return _value;
}

//###############################################################################################################
//###############################################################################################################

function clear_chart() {
    
    for(let i = 0; i < global_chart_x; i++)
        for(let j = 0; j < global_chart_y; j++)
            chart[j][i] = " ";
}

//###############################################################################################################
//###############################################################################################################

function print_chart() {
    
    // console.clear();
    console.log("");
    console.log("    [a] [b] [c] [d] [e] [f] [g] [h] [i] [j] [k] [l]");
    
    for(let i = 0; i < global_chart_y; i++) {
        in_line_string += ("[" + (i) + "] ");
        for(let j = 0; j < global_chart_x; j++) in_line_string += ("[" + chart[j][i] + "] ");
        console.log(in_line_string);
        in_line_string = "";
    }
}

//###############################################################################################################
//###############################################################################################################

function chart_fill_random() {
    
    let rx = 0, ry = 0, _aux_cont = 0;

    do{
        if(_aux_cont >= 2 * global_chart_x * global_chart_y){
            if(_aux_cont < 10000){
                rx = 0;
                ry = 0;
                _aux_cont = 10000;
            }

            rx++;
            if(rx >= global_chart_x){
                rx = 0;
                ry++;
            }
        }
        else{
            rx = random_range(0, global_chart_x - 1);
            ry = random_range(0, global_chart_y - 1);
            ++_aux_cont;
        }

    } while( chart[rx] !== undefined && chart[rx][ry] !== " ");

    chart[rx][ry] = "x";
    // console.log(++debug,"new x:", rx, ry);
    // return [rx, ry];
}

//###############################################################################################################
//###############################################################################################################

function seek_mines(){
    
    for(let i = 0; i < global_chart_x; i++){

        for(let j = 0; j < global_chart_y; j++){

            if(chart[i][j] !== "x"){

                chart[i][j] *= 0;
                if(chart[i+1] != undefined && chart[i+1][j] == "x") chart[i][j]++;
                if(chart[i+1] != undefined && chart[i+1][j+1] == "x") chart[i][j]++;
                if(chart[i  ] != undefined && chart[i  ][j+1] == "x") chart[i][j]++;
                if(chart[i-1] != undefined && chart[i-1][j+1] == "x") chart[i][j]++;

                if(chart[i-1] != undefined && chart[i-1][j] == "x") chart[i][j]++;
                if(chart[i-1] != undefined && chart[i-1][j - 1] == "x") chart[i][j]++;
                if(chart[i  ] != undefined && chart[i  ][j - 1] == "x") chart[i][j]++;
                if(chart[i+1] != undefined && chart[i+1][j - 1] == "x") chart[i][j]++;

                if(chart[i][j] == 0) chart[i][j] = " ";
            }
        }
    }
}

//###############################################################################################################
//###############################################################################################################

function show_mines(){
    const all_obj_mines = document.querySelectorAll("button.cell.cell-not-clicked[name=mine]");
    for (const _mine of all_obj_mines) _mine.click();

    starting_cell = null;
    window.clearInterval(interval_id);
    time_display.style.color = "#009688";
    time_display.style.fontStyle = "italic";
    interval_id = null;
    lose_yet = true;
}

//###############################################################################################################
//###############################################################################################################

function win_game(){

    const obj_status = document.querySelector("#status");
    obj_status.innerText = "Win! B)";
    obj_status.style.color = "var(--color-status-win)";
    obj_status.style.textShadow = "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000";

    starting_cell = null;
    window.clearInterval(interval_id);
    time_display.style.color = "#009688";
    time_display.style.fontStyle = "italic";
    if(time_display.innerText = "00:00.000") time_display.innerText = "wow dude";

    points -= Math.floor((performance.now() - timeprev) / 1000); // Time penalty
    if(!lose_yet) points += 1000; // Winning reward
    points = boundaries(0, points, points);

    if(points > highscore){
        localStorage.setItem("mines_global_highscore", `${points}`);
        highscore = points;

        const obj_highscore = document.querySelector("#highscore");
        obj_highscore.innerText = "record!";
    }

    const obj_points = document.querySelector("#points");
    obj_points.innerText = points;

    interval_id = null;
    lose_yet = true;
}

//###############################################################################################################
//###############################################################################################################

function show_empty(_xx, _yy){

    let _next_click = 0;
    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx + 1}-${_yy + 0}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx + 1}-${_yy + 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx + 1}-${_yy - 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx - 1}-${_yy + 0}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx - 1}-${_yy + 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx - 1}-${_yy - 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx + 0}-${_yy + 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; }

    _next_click = document.querySelector(`button.cell.cell-not-clicked[name="${_xx + 0}-${_yy - 1}"]`);
    if(_next_click != undefined){ stack_clicks.push(_next_click);
    _next_click.name = "clicked"; } //_next_click.click();
}

//###############################################################################################################
//###############################################################################################################

function start_chart(){
    const obj_chart = document.querySelector("#chart");

    for(let i = 0; i < global_chart_y; i++){

        for(let j = 0; j < global_chart_x; j++){

            const obj_element = document.createElement("button");

            obj_element.oncontextmenu = function(event) {
                event.preventDefault();
            };

            obj_element.style.backgroundSize = "cover";
            obj_element.style.backgroundPosition = "center";

            obj_element.classList.add("cell-not-clicked", "cell");
            // console.log(i, j, chart[j][i]);
            obj_element.innerText = `${chart[j][i]}`;

            if(chart[j][i] == "x"){ // ###################################### CLICK ON A MINE
                obj_element.name = "mine";

                obj_element.addEventListener("click", function test() {

                    if(starting_cell != null){

                        //First click
                        const obj_status = document.querySelector("#status");
                        if(obj_status.innerText != "BOOM! X("){
                            obj_status.innerText = "BOOM! X(";
                            obj_status.style.color = "var(--color-status-lose)";
                            obj_element.name = "clicked";
                            obj_element.style.backgroundColor = "var(--color-fail)";
                            show_mines();
                        }

                        obj_element.classList.add("cell-clicked");
                        obj_element.style.color = "red";

                        obj_element.removeEventListener("click", test);
                    }

                    if(starting_cell == null && !lose_yet) start_game();
                    
                });

                obj_element.onmousedown = function(event) { // RIGHT CLICK
                    if(event.which == 3 && starting_cell != null){
                    
                        if(obj_element.style.backgroundImage != "var(--flag)"){
                            obj_element.style.backgroundImage = "var(--flag)";
                            flags_needed--;
                        }
                        else {
                            obj_element.style.backgroundImage = "none";
                            flags_needed++;
                        }

                        if(free_spaces <= 0 || flags_needed <= 0) win_game();
                    }
                }
            }
            else if(chart[j][i] == " "){ // ################################ CLICK ON A EMPTY SPACE

                obj_element.name = `${j}-${i}`;

                obj_element.addEventListener("click", function test() {
                    
                    if(starting_cell != null){

                        obj_element.name = "clicked";
                        
                        if(obj_element.style.backgroundImage == "var(--flag)"){
                            obj_element.style.backgroundImage = "none";
                            flags_needed--;
                        }

                        obj_element.classList.add("cell-clicked");
                        free_spaces--;
                        // stack_num--;
                        show_empty(j, i);

                        // console.log(stack_clicks);

                        if(stack_num == true){
                            stack_num = false;

                            while(stack_clicks[0] != undefined){
                                let lol = stack_clicks.splice(0, 1);
                                lol[0].click();
                            }

                            stack_num = true;
                        }

                        if(free_spaces <= 0 || flags_needed <= 0) win_game();

                        obj_element.removeEventListener("click", test);
                    }

                    if(starting_cell == null && !lose_yet) start_game();
                });

                obj_element.onmousedown = function(event) {
                    if(event.which == 3 && starting_cell != null && obj_element.name != "clicked"){ // RIGHT CLICK                        
                        if(obj_element.style.backgroundImage != "var(--flag)"){
                            obj_element.style.backgroundImage = "var(--flag)";
                            flags_needed++;
                        }
                        else {
                            obj_element.style.backgroundImage = "none";
                            flags_needed--;
                        }

                        if(free_spaces <= 0 || flags_needed <= 0) win_game();
                    }
                }
            }
            else{ // ############################## CLICK ELSEWHERE (A NUMBER)

                obj_element.name = `${j}-${i}`;

                obj_element.addEventListener("click", function test() {
                    
                    if(starting_cell != null){

                        obj_element.name = "clicked";

                        if(obj_element.style.backgroundImage == "var(--flag)"){
                            obj_element.style.backgroundImage = "none";
                            flags_needed--;
                        }

                        free_spaces--;
                        
                        obj_element.classList.add("cell-clicked");
                        obj_element.style.color = `var(--color-number${obj_element.innerText})`;

                        points += (parseInt(obj_element.innerText) * multiplier * 10);
                        points = Math.floor(points);

                        if(free_spaces <= 0 || flags_needed <= 0) win_game();

                        const obj_points = document.querySelector("#points");
                        obj_points.innerText = points;

                        obj_element.removeEventListener("click", test);
                    }

                    if(starting_cell == null && !lose_yet) start_game();
                });

                obj_element.onmousedown = function(event) {
                    if(event.which == 3 && starting_cell != null && obj_element.name != "clicked"){ // RIGHT CLICK

                        if(obj_element.style.backgroundImage != "var(--flag)"){
                            obj_element.style.backgroundImage = "var(--flag)";
                            flags_needed++;
                        }
                        else {
                            obj_element.style.backgroundImage = "none";
                            flags_needed--;
                        }

                        if(free_spaces <= 0 || flags_needed <= 0) win_game();
                    }
                }
            }

            obj_chart.appendChild(obj_element);
        }
    }
}

//###############################################################################################################
//###############################################################################################################

function start_game(){

    starting_cell = null;
    let _aux_cont = 0;
    let _aux = document.querySelectorAll('button.cell.cell-not-clicked');

    for (const _cell of _aux){
        if(_cell.innerText == "") {
            starting_cell = _cell;
            break;
    }   }

    while(starting_cell == null){
        _aux_cont ++;
        _aux = document.querySelectorAll('button.cell.cell-not-clicked');
        
        for (const _cell of _aux){
            if(_cell.innerText == _aux_cont) {
                starting_cell = _cell;
                break;
        }   }

        if(_aux_cont >= 9){
            console.log("error");
            break;
        }
    }

    starting_cell.click();

    stack_num = true;

    const obj_status = document.querySelector("#status");
    obj_status.innerText = "good :)";
    obj_status.style.color = "var(--color-status-good)";

    check_percentage(false);

    // const obj_span_mines = document.querySelector("span#mines");
    // obj_span_mines.innerText = global_mines_max;

    const obj_points = document.querySelector("#points");
    obj_points.innerText = points;

    start_time();

    if(free_spaces <= 0 || flags_needed <= 0) win_game();
    
}

//###############################################################################################################
//###############################################################################################################

function reset_all(){

    global_chart_x = JSON.parse(localStorage.getItem("mines_global_chart_x"), 10);

    if(global_chart_x == null){ // FIRST TIME OPENING
        default_data();
        global_chart_x = JSON.parse(localStorage.getItem("mines_global_chart_x"), 10);

    }

    global_chart_y = JSON.parse(localStorage.getItem("mines_global_chart_y"), 10);
    global_mines_max = JSON.parse(localStorage.getItem("global_mines_max"), 10);

    global_percentage_mode = JSON.parse(localStorage.getItem("global_percentage_mode"), 10);
    global_percentage = JSON.parse(localStorage.getItem("global_percentage"), 10);

    global_mines_max = boundaries(1, global_mines_max, (global_chart_x*global_chart_y) - 2 );

    if(global_percentage_mode == 0) multiplier = Math.sin( ( global_mines_max / (global_chart_x*global_chart_y-2) ) * Math.PI);
    else multiplier = Math.sin(global_percentage / 100 * Math.PI);

    multiplier += 1;

    points = (global_chart_x * global_chart_y) * (10 * multiplier) + (check_percentage(true) * 10);
    // points = multiplier * 100;
    points = Math.floor(points);

    highscore = JSON.parse(localStorage.getItem("mines_global_highscore"), 10);
    if(highscore == null) highscore = 0;

    in_line_string = "";
    stack_num = true;

    starting_cell = null;
    lose_yet = false;
    free_spaces = (global_chart_x * global_chart_y) - check_percentage(true);
    flags_needed = check_percentage(true);
    
    chart = [];
    chart = new Array(global_chart_x).fill(" ").map(()=>new Array(global_chart_y).fill(" "));

    const obj_chart_childs = document.querySelectorAll("div#chart > *");
    for(let _item of obj_chart_childs) _item.remove();

    const obj_status = document.querySelector("#status");
    obj_status.style.textShadow = "";
    obj_status.innerText = "waiting...";
    obj_status.style.color = "#5A341C";

    // const obj_span_mines = document.querySelector("span#mines");
    // obj_span_mines.innerText = global_mines_max;

    const obj_time = document.querySelector("#time");
    obj_time.innerText = "00:00.000";

    const obj_points = document.querySelector("#points");
    obj_points.innerText = points;

    const obj_highscore = document.querySelector("#highscore");
    obj_highscore.innerText = highscore;

    // FILL INPUTS

    check_percentage(false);
    // const obj_input_mines = document.querySelector("input#mines");
    // obj_input_mines.value = global_mines_max;
    // obj_input_mines.setAttribute("max", `${(global_chart_x*global_chart_y) - 2 }`);
    
    const obj_input_chartX = document.querySelector("#chart-x");
    obj_input_chartX.value = global_chart_x;
    
    const obj_input_chartY = document.querySelector("#chart-y");
    obj_input_chartY.value = global_chart_y;

    // if(global_percentage_mode == 1){
    //     const obj_percentage = document.querySelector("#percentage");
    //     obj_percentage.style.color = "lime";
    //     obj_percentage.innerText = "% on";
    // }

    //CSS Variables
    var html = document.querySelector("html");
    html.style.setProperty("--square-size" , `calc(100vh / ${Math.max(global_chart_x, global_chart_y)})`);
    html.style.setProperty("--chart-hsize", `calc((${global_chart_x} * var(--square-size) ))`);
    html.style.setProperty("--chart-vsize", `calc((${global_chart_y} * var(--square-size) ))`);

    // Timer stuff
    time_display = document.querySelector("#time");
    time_display.style.fontStyle = "normal";
    time_display.style.color = "rgb(20, 175, 14)";
    time_display.innerText = "00:00.000";
    window.clearInterval(interval_id);
    interval_id = null;

}

//###############################################################################################################
//###############################################################################################################


function start_time(){

    if(interval_id === null){
        interval_id = window.setInterval(say_time, 10, time_display);
        timeprev = performance.now();
    }
}

//###############################################################################################################
//###############################################################################################################


function say_time(_display){

    let timestop = performance.now();

    let _mil = Math.floor(timestop - timeprev);
    let _seg = Math.floor((_mil / 1000) % 60);
    let _min = Math.floor((_mil / 1000) / 60);
    _mil = Math.floor(_mil % 1000);

    // console.log(_mil, _seg, _min);

    let _time_string = "";
    _time_string += _min < 10 ? "0"+_min+":" : _min+":";
    _time_string += _seg < 10 ? "0"+_seg+"." : _seg+".";
    _time_string += _mil < 100? "0"      : "";
    _time_string += _mil < 10 ? "0"+_mil : _mil;

    // console.log(_time_string);

    if(_display !== undefined) _display.innerText = _time_string;

    return _time_string;
}

//###############################################################################################################
//###############################################################################################################

function reset_game(){

    global_mines_max = boundaries(1, global_mines_max, (global_chart_x*global_chart_y) - 2 );
    let _current_mines = check_percentage(true);
    for(let i = 0; i < _current_mines; i++) chart_fill_random();

    // console.clear();
    print_chart();
    seek_mines();
    // print_chart();
    start_chart();
}

//###############################################################################################################
//###############################################################################################################

function save_data(){
    // FILL INPUTS
    const obj_input_mines = document.querySelector("input#mines");
    
    const obj_input_chartX = document.querySelector("#chart-x");
    
    const obj_input_chartY = document.querySelector("#chart-y");

    localStorage.setItem("mines_global_chart_x", boundaries(3, obj_input_chartX.value, 20));
    localStorage.setItem("mines_global_chart_y", boundaries(3, obj_input_chartY.value, 20));

    if(global_percentage_mode == 0) localStorage.setItem("global_mines_max", boundaries(1, obj_input_mines.value, (global_chart_x*global_chart_y) - 2 ));
    else localStorage.setItem("global_percentage", boundaries(1, obj_input_mines.value, 100));

    localStorage.setItem("global_percentage_mode", global_percentage_mode);
    
}

//###############################################################################################################
//###############################################################################################################

function default_data(){
    localStorage.setItem("mines_global_chart_x", "10");
    localStorage.setItem("mines_global_chart_y", "10");

    localStorage.setItem("global_mines_max", "10");

    localStorage.setItem("global_percentage_mode", "1");
    localStorage.setItem("global_percentage", "10");
}

//###############################################################################################################
//###############################################################################################################

function check_percentage(_return){

    // Si no se escribe algo, regresa el no. de minas correspondientes
    if(_return == true){

        if(global_percentage_mode == 1) return boundaries(1, Math.floor( (global_chart_x * global_chart_y) / 100 * global_percentage), (global_chart_x * global_chart_y - 2));
        else return global_mines_max;
    }

    const obj_percentage = document.querySelector("#percentage");

    // ########################################### PERCENTAGE ON
    if(global_percentage_mode == 1){

        obj_percentage.style.color = "lime";
        obj_percentage.innerText = "% on";

        const obj_span_mines = document.querySelector("span#mines");
        obj_span_mines.innerText = boundaries(1, Math.floor( (global_chart_x * global_chart_y) / 100 * global_percentage), (global_chart_x * global_chart_y - 2));

        const obj_input_mines = document.querySelector("input#mines");
        obj_input_mines.value = global_percentage;
        obj_input_mines.setAttribute("max", `${100}`);
    }
    else{ // ############################# PERCENTAGE OFF

        obj_percentage.style.color = "red";
        obj_percentage.innerText = "% off";

        const obj_span_mines = document.querySelector("span#mines");
        obj_span_mines.innerText = global_mines_max;

        const obj_input_mines = document.querySelector("input#mines");
        obj_input_mines.value = global_mines_max;
        obj_input_mines.setAttribute("max", `${(global_chart_x*global_chart_y) - 2 }`);
    }
}

//###############################################################################################################
//###############################################################################################################

let global_chart_x, global_chart_y, global_mines_max;
let points, highscore, multiplier = 0;
let time_display = 0;
let interval_id = null, timeprev = 0;

let in_line_string = "";
let stack_num = true;
let stack_clicks = [];

let starting_cell = null;
let lose_yet = false, free_spaces = 0, flags_needed = 0;

let global_percentage_mode = 0, global_percentage = 0;

let chart;

let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

document.addEventListener("DOMContentLoaded", () => {

    reset_all();

    // START BUTTON
    const obj_button_startGame = document.querySelector("#start-game");
    obj_button_startGame.addEventListener("click", () => {

        if(starting_cell == null && !lose_yet) start_game();
    });

    // NEW GAME BUTTON
    const obj_button_newGame = document.querySelector("#new-game");
    obj_button_newGame.addEventListener("click", () => {

        save_data();

        reset_all();
        reset_game();
    });

    // DEFAULT BUTTON
    const obj_default = document.querySelector("#default");
    obj_default.addEventListener("click", () => {
        
        default_data();

        reset_all();
        reset_game();
    });

    // PERCENTAGE BUTTON
    const obj_percentage = document.querySelector("#percentage");
    obj_percentage.addEventListener("click", (event) => {
        event.preventDefault();
        
        if(starting_cell == null && !lose_yet){

            if(global_percentage_mode == 0) global_percentage_mode = 1;
            else global_percentage_mode = 0;

            check_percentage(false);
            localStorage.setItem("global_percentage_mode", global_percentage_mode);
        }

    });

    reset_game();

});
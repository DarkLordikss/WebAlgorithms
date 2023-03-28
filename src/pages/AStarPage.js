import React from "react";
import "./styles/AStarPage.css";
import star_image from './images/a_star_logo5.png';
//импорт нужного модуля для страницы AStarPage.js (self)
import "../scripts/AStarFrontScript.js";
//Очень важно: js модуль для страницы должен быть единственный, так что
//доп. модули инмпортить внурь основного (так ничего не сломается и выглядит лучше)


const AStarPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    <a href="/">
                        <img src={star_image} className="logo unselectable" id="logo_star" alt="logo A Star" />
                    </a>
                    <div id="naming" className="unselectable">A-Star algorithm</div>
                    <input type="number" id="n_number" />
                    <div id="load_difficulty_info" className="unselectable">zero</div>
                    <button id="create_subm" className="subm_button unselectable">create matrix!</button>
                    <button id="maze_subm" className="subm_button unselectable">generate maze!</button>
                    <button id="solution_subm" className="subm_button unselectable">solution!</button>
                    <button id="enum_switch" className="switch_button false unselectable" value="enum">numerate</button>
                </div>
                <div id="container">
                    <div id="matrix_box">
                        <div id="path_start" className="movable_block -1_-1"></div>
                        <div id="path_end" className="movable_block -1_-1"></div>
                    </div>
                </div>
                <div id="animated_background">
                    <div id="mov_box_0" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "5vw"}}></div>
                    <div id="mov_box_1" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "0vw"}}></div>
                    <div id="mov_box_2" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "7vw"}}></div>
                    <div id="mov_box_3" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "50vw"}}></div>
                    <div id="mov_box_4" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "25vw"}}></div>
                    <div id="mov_box_5" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "35vw"}}></div>
                    <div id="mov_box_6" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "66vw"}}></div>
                    <div id="mov_box_7" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "87vw"}}></div>
                    <div id="mov_box_8" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "70vw"}}></div>
                    <div id="mov_box_9" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "14vw"}}></div>
                    <div id="mov_box_10" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "115vh", left: "0vw"}}></div>
                    <div id="mov_box_11" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "115vh", left: "54vw"}}></div>
                    <div id="mov_box_12" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "115vh", left: "79vw"}}></div>
                    <div id="mov_box_13" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "115vh", left: "20vw"}}></div>
                    <div id="mov_box_14" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "25vw"}}></div>
                    <div id="mov_box_15" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "35vw"}}></div>
                    <div id="mov_box_16" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "66vw"}}></div>
                    <div id="mov_box_17" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "87vw"}}></div>
                    <div id="mov_box_18" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "70vw"}}></div>
                    <div id="mov_box_19" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "14vw"}}></div>
                    <div id="mov_box_20" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "115vh", left: "0vw"}}></div>
                    <div id="mov_box_21" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "115vh", left: "54vw"}}></div>
                    <div id="mov_box_22" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "115vh", left: "79vw"}}></div>
                    <div id="mov_box_23" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "115vh", left: "20vw"}}></div>
                    <div id="mov_box_24" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "25vw"}}></div>
                    <div id="mov_box_25" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "35vw"}}></div>
                    <div id="mov_box_26" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "66vw"}}></div>
                    <div id="mov_box_27" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "87vw"}}></div>
                    <div id="mov_box_28" className="back_moving_box_t1" value="-1_-1_-1_-1" style={{top: "-1vh", left: "70vw"}}></div>
                    <div id="mov_box_29" className="back_moving_box_t2" value="-1_-1_-1_-1" style={{top: "-1vh", left: "14vw"}}></div>
                </div>
            </div>
    );
};

export default AStarPage;

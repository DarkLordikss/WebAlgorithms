import React from "react";
import "./AStarPage.css";
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
                        <img src={star_image} className="logo unselectable" id="logo_star" />
                    </a>
                    <div id="naming" className="unselectable">A-Star algorithm</div>
                    <input type="number" id="n_number" />
                    <div id="load_difficulty_info">zero</div>
                    <button id="create_subm" className="subm_button unselectable">create matrix!</button>
                    <button id="maze_subm" className="subm_button unselectable">generate maze!</button>
                    <button id="solution_subm" className="subm_button unselectable">solution!</button>
                    <button id="clear_subm" className="subm_button unselectable">clear matrix!</button>
                    <button id="enum_switch" className="switch_button false unselectable" value="enum">numerate</button>
                </div>
                <div id="container">
                    <div id="matrix_box">
                        <div id="path_start" className="movable_block -1_-1"></div>
                        <div id="path_end" className="movable_block -1_-1"></div>
                    </div>
                </div>
            </div>
    );
};

export default AStarPage;

import React from "react";
import "./AStarPage.css";
import star_image from './images/a_star_logo5.png';
import {generateMaze} from "../scripts/mazeGenerator.js";
import {aStarPathfinding} from "../scripts/aStarAlgo.js";
import "../scripts/AStarFrontScript.js";
import "../scripts/jQueryAStarFront.js";

const AStarPage = () => {
    return (
            <div>
                <div id="header">
                    <img src={star_image} className="logo" id="logo_star" />
                    <div id="naming">A-Star algorithm</div>
                    <input type="number" id="n_number" />
                    <button id="create_subm" className="subm_button">create matrix!</button>
                    <button id="maze_subm" className="subm_button">generate maze!</button>
                    <button id="solution_subm" className="subm_button">solution!</button>
                    <button id="clear_subm" className="subm_button">clear matrix!</button>
                    <button id="enum_switch" className="switch_button false" value="enum">numerate</button>
                </div>
                <div id="container">
                    <div id="matrix_box">
                    </div>
                </div>
            </div>
    );
};

export default AStarPage;

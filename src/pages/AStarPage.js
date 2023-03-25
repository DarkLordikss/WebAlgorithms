import React from "react";
import "./AStarPage.css";
import star_image from './images/a_star_logo5.png';

const AStarPage = () => {
    return (
        <html lang="ru">
            <body>
                <div id="header">
                    <img src={star_image} class="logo" id="logo_star" />
                    <div id="naming">A-Star algorithm</div>
                    <input type="number" value={5} id="n_number" />
                    <button id="create_subm" class="subm_button">create matrix!</button>
                    <button id="maze_subm" class="subm_button">generate maze!</button>
                    <button id="solution_subm" class="subm_button">solution!</button>
                    <button id="clear_subm" class="subm_button">clear matrix!</button>
                    <button id="enum_switch" class="switch_button false" value="enum">numerate</button>
                </div>
                <div id="container">
                    <div id="matrix_box">
                    </div>
                </div>
            </body>
        </html>
    );
};

export default AStarPage;

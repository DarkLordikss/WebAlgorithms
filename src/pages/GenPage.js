import React from "react";
import "./styles/GenPage.css";
import star_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы GenPage.js (self)
import "../scripts/genAlgoFrontScript.js";


const GenPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    <a href="/">
                        <img src={star_image} className="logo unselectable" id="logo_gen" alt="logo genAlgo" />
                    </a>
                    <div id="naming" className="unselectable">Gen algorithm</div>
                    <div id="points_counter" className="unselectable">0</div>

                    <input id="gens_counter" className="unselectable" type={"number"}></input>
                    <div id="generations" className="unselectable">generations</div>

                    <input id="evolution_changer" className="unselectable" type={"number"}></input>
                    <div id="evolution" className="unselectable">mutatt chance (0.1%)</div>

                    <input id="popSize_changer" className="unselectable" type={"number"}></input>
                    <div id="population" className="unselectable">population size</div>
                    
                    <div id="speed_mode" className="unselectable false">slow mode</div>
                    <div id="skip_button" className="unselectable false">skip animation</div>
                    <div id="start_button" className="unselectable">start</div>
                </div>
                <div id="container">
                    <div id="pointing_box"></div>
                    <div id="evol_loader" className="unselectable">evolving...</div>
                </div>
            </div>
    );
};

export default GenPage;

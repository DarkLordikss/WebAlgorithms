import React from "react";
import "./styles/GenPage.css";
import gen_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы GenPage.js (self)
import "../scripts/genAlgoFrontScript.js";


const GenPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    <img src={gen_image} className="logo unselectable" id="logo_gen" alt="logo genAlgo" />

                    <div id="naming" className="unselectable">Gen algorithm</div>
                    <div id="points_counter" className="unselectable">0</div>

                    <input id="gens_counter" className="unselectable" type={"number"}></input>
                    <div id="generations" className="unselectable"> max gens</div>

                    <input id="evolution_changer" className="unselectable" type={"number"}></input>
                    <div id="evolution" className="unselectable">mutate chance (0.1%)</div>

                    <input id="popSize_changer" className="unselectable" type={"number"}></input>
                    <div id="population" className="unselectable">population size</div>
                    
                    <div id="speed_mode" className="unselectable false">slow mode</div>
                    <div id="skip_button" className="unselectable false">skip animation</div>
                    <div id="start_button" className="unselectable">start</div>
                </div>
                <div id="container">
                    <div id="pointing_box"></div>
                    <div id="evol_loader" className="unselectable">evolving...</div>
                    <div id="console" className="unselectable">
                        <div id="log_0" className="consol_log unselectable hundred"></div>
                        <div id="log_1" className="consol_log unselectable ninety"></div>
                        <div id="log_2" className="consol_log unselectable seventy"></div>
                        <div id="log_3" className="consol_log unselectable fifty"></div>
                        <div id="log_4" className="consol_log unselectable twenty-five"></div>
                        <div id="log_5" className="consol_log unselectable zero"></div>
                    </div>
                    {/* <audio src="./ultramode_song.mp3" id="ultraSound"></audio> */}
                </div>
                <div class='logo_loading' id='back_logo'></div>
                <div class='back_black' id='back_load'></div>
            </div>
    );
};

export default GenPage;

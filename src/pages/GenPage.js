import React from "react";
import "./styles/GenPage.css";
//импорт нужного модуля для страницы GenPage.js (self)
import "../scripts/genAlgoFrontScript.js";


const GenPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    <div id="naming" className="unselectable">Gen algorithm</div>
                    <div id="points_counter" className="unselectable">0</div>
                </div>
                <div id="container">
                    <div id="pointing_box">
                        
                    </div>
                </div>
            </div>
    );
};

export default GenPage;

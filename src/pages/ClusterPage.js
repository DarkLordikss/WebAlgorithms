import React from "react";
import "./styles/ClusterPage.css";
// import cluster_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы GenPage.js (self)
import "../scripts/genAlgoFrontScript.js";


const ClusterPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    {/* <a href="/">
                        <img src={cluster_image} className="logo unselectable" id="logo_gen" alt="logo genAlgo" />
                    </a> */}
                    <div id="naming" className="unselectable">Cluter algorithm</div>
                    <div id="points_counter" className="unselectable">0</div>
                    
                    {/*<div id="start_button" className="unselectable">start</div> */}
                </div>
                <div id="container">
                    <div id="pointing_box"></div>
                </div>
            </div>
    );
};

export default ClusterPage;

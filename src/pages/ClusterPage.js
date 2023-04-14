import React from "react";
import "./styles/СlusterPage.css";
// import cluster_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы GenPage.js (self)
import "../scripts/clusterFrontScript.js";


const ClusterPage = () => {
    return (
            <div className="a-bg">
                <canvas id="canvasBack"></canvas>
                <div id="header">
                    {/* <a href="/">
                        <img src={cluster_image} className="logo unselectable" id="logo_gen" alt="logo genAlgo" />
                    </a> */}
                    <div id="naming" className="unselectable">Cluter algorithm</div>
                    <div id="points_counter" className="unselectable">0</div>

                    <input id="cluster_counter" className="unselectable" type={"number"}></input>
                    <div id="clusters" className="unselectable">clusters</div>
                    
                    <div id="clust_start_button" className="unselectable">start</div>
                </div>
                <div id="container">
                    <div id="pointing_box_cl">
                        <canvas id="canvasFon"></canvas>
                    </div>
                </div>
            </div>
    );
};

export default ClusterPage;

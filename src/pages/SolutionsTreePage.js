import React from "react";
import "./styles/SolutionsTreePage.css";
import neuro_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы NeuronPage.js (self)
import "../scripts/SolutionsTreeScript.js";

const SolutionsTreePage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    {/* <img src={neuro_image} className="logo unselectable" id="logo_neuro" alt="logo neuro" /> */}

                    <div id="naming" className="unselectable">Solutions Tree</div>
                    <form method="post" enctype="multipart/form-data" id="forma">
                        <label class="input-file">
                            <input type="file" id="dataset" name="dataset" accept="text/csv"></input>
                            <span class="input-file-text" type="text">Choose File</span>
                        </label>
                    </form>
                    <div id="checker">
                        <div id="piston"></div>
                    </div>
                    <div id="inputsField">
                        <input type="number" id="maxDethInp" className="catOne"></input>
                        <div id="maxdepthName" className="catOne">max depth</div>

                        <input type="number" id="minLeafSamplesInp" className="catOne"></input>
                        <div id="minLeafSamplesName" className="catOne">minimum leaf samples</div>

                        <input type="number" id="maxLeafNodesInp" className="catOne"></input>
                        <div id="maxLeafNodesName" className="catOne">max leaf nodes</div>
                        
                        <input type="text" id="desisionInp" className="catTwo"></input>
                        <div id="desisionName" className="catTwo">enter a string</div>
                    </div>
                    <div id="send_button_t" className="unselectable">send</div>
                </div>
                <div id="container">
                    <canvas id="drawingTree"></canvas>
                    <div id="treeBox" className="unselectable">
                        
                    </div>
                </div>
                <div className='logo_loading' id='back_logo'></div>
                <div className='back_black' id='back_load'></div>
            </div>
    );
};

export default SolutionsTreePage;

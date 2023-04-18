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
                    <div id="send_button_t" className="unselectable">send</div>
                </div>
                <div id="container">
                    <div id="treeBox" className="unselectable">
                        <canvas id="drawingTree"></canvas>
                        <div id="weatherStates" className="states">
                            <div id="sunny" className="checkingBox three state unchecked unlocked">sunny</div>
                            <div id="overcast" className="checkingBox three state unchecked unlocked">overcast</div>
                            <div id="rainy" className="checkingBox three state unchecked unlocked">rainy</div>
                        </div>
                        <div id="weatherTemperatures" className="states">
                            <div id="hot" className="checkingBox three temperature unchecked unlocked">hot</div>
                            <div id="mild" className="checkingBox three temperature unchecked unlocked">mild</div>
                            <div id="cold" className="checkingBox three temperature unchecked unlocked">cold</div>
                        </div>
                        <div id="weatherPressures" className="states">
                            <div id="high" className="checkingBox two pressure unchecked unlocked">high</div>
                            <div id="normal" className="checkingBox two pressure unchecked unlocked">low</div>
                        </div>
                        <div id="weatherBool" className="states">
                            <div id="true" className="checkingBox two bool unchecked unlocked">true</div>
                            <div id="false" className="checkingBox two bool unchecked unlocked">false</div>
                        </div>
                        <div id="weatherAnswer" className="states">
                            <div id="yes" className="checkingBox two answer unchecked unlocked">yes</div>
                            <div id="no" className="checkingBox two answer unchecked unlocked">no</div>
                        </div>
                    </div>
                    
                </div>
                <div className='logo_loading' id='back_logo'></div>
                <div className='back_black' id='back_load'></div>
            </div>
    );
};

export default SolutionsTreePage;

import React from "react";
import "./styles/NeuronPage.css";
// import star_image from './images/genAlgo_logo2.png';
//импорт нужного модуля для страницы NeuronPage.js (self)
import "../scripts/neuronFrontScript.js";




const NeuronPage = () => {
    return (
            <div className="a-bg">
                <div id="header">
                    {/* <a href="/">
                        <img src={star_image} className="logo unselectable" id="logo_gen" alt="logo genAlgo" />
                    </a> */}
                    <div id="naming" className="unselectable">Neiron</div>
                    <div id="send_button" className="unselectable">say number</div>
                    <div id="resolutionVal" className="unselectable">50x50</div>
                    <div id="resolutionName" className="unselectable">resolution</div>
                    <input type="range" className="unselectable" name="resolution" id="resolutionChanger" defaultValue={50} min={10} max={150} step={1} />
                    <div id="brushVal" className="unselectable">5</div>
                    <div id="brushName" className="unselectable">brush size</div>
                    <input type="range" className="unselectable" name="brushSize" id="brushChanger" defaultValue={5} min={1} max={10} step={0.1} />
                    <div id="colorPicker">
                        <div className="colorOption pickedCan blackCan" id="color_0"></div>
                        <div className="colorOption defaultCan whiteCan" id="color_1"></div>
                        <div className="colorOption defaultCan redCan" id="color_2"></div>
                        <div className="colorOption defaultCan orangeCan" id="color_3"></div>
                        <div className="colorOption defaultCan yellowCan" id="color_4"></div>
                        <div className="colorOption defaultCan greenCan" id="color_5"></div>
                        <div className="colorOption defaultCan cyanCan" id="color_6"></div>
                        <div className="colorOption defaultCan blueCan" id="color_7"></div>
                        <div className="colorOption defaultCan purpleCan" id="color_8"></div>
                        <div className="colorOption defaultCan pinkCan" id="color_9"></div>
                    </div>
                    <div id="clear_button" className="unselectable">clear</div>
                </div>
                <div id="container">
                    <div id="robot">
                        <div id="rHead">
                            <div id="rEyeA_L"><div id="rEyeB_L"></div></div>
                            
                            <div id="rEyeA_R"><div id="rEyeB_R"></div></div>
                            
                            <div id="veco_fun_L"></div>
                            <div id="veco_fun_R"></div>
                            <div id="veco_angry_L"></div>
                            <div id="veco_angry_R"></div>
                            <div id="rMouth"></div>
                        </div>
                        <div id="rBody"></div>
                        <div id="rNeck">
                            <div id="rNeck_seg_0"></div>
                            <div id="rNeck_seg_1"></div>
                            <div id="rNeck_seg_2"></div>
                            <div id="rNeck_seg_3"></div>
                        </div>
                    </div>
                    <canvas id="drawingField"></canvas>
                </div>
            </div>
    );
};

export default NeuronPage;

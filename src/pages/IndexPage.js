import React from 'react';

import './styles/App.css'
import Albedo from "./persons/Albedo";
import Rat from "./persons/Rat";
import N from "./persons/N";


const IndexPage = () => {
    return (
            <body>
                {/* <code id="bracket-left">&lt;</code>
                <code id="bracket-right">&gt;</code>
                <div id="logo"><code>▲<br />/blank<br />project</code></div> */}
                {/* <div id="back"></div> */}
                <div className="menu">
                    <div className="menu-start" id="a-star">
                        <a href="/a-star"><div className="menu-elem"><code>A-star</code></div></a>
                        <Albedo />
                    </div>
                    <div id="genetic">
                        <a href="/genetic"><div className="menu-elem"><code>Genetic</code></div></a>
                        <Rat />
                    </div>
                    <a href="/a-star">
                        <div className="menu-elem"><code>Two</code></div>
                    </a>
                    <div id="neuron">
                        <a href="/neuron">
                            <div className="menu-elem"><code>Neuron</code></div>
                            <N />
                        </a>
                    </div>
                    <a href="/a-star">
                        <div className="menu-elem"><code>Four</code></div>
                    </a>
                    <div className="menu-end">
                        <a href="/a-star"><div className="menu-elem"><code>Five</code></div></a>
                    </div>
                </div>
                <div class='logo_loading' id='back_logo'></div>
                <div class='back_black' id='back_load'></div>
            </body>
    );
};

export default IndexPage;
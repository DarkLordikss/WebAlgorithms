import React from 'react';

import './App.css'
import Albedo from "./persons/Albedo";

const IndexPage = () => {
    return (
            <body>
                <code id="bracket-left">&lt;</code>
                <code id="bracket-right">&gt;</code>
                <div id="logo"><code>▲<br />/blank<br />project</code></div>
                <div id="back"></div>
                <div className="menu">
                    <div className="menu-start" id="a-star">
                        <a href="/a-star"><div className="menu-elem"><code>A-star</code></div></a>
                        <Albedo />
                    </div>
                    <a href="/genetic">
                        <div className="menu-elem"><code>Genetic</code></div>
                    </a>
                    <a href="/a-star">
                        <div className="menu-elem"><code>Two</code></div>
                    </a>
                    <a href="/a-star">
                        <div className="menu-elem"><code>Three</code></div>
                    </a>
                    <a href="/a-star">
                        <div className="menu-elem"><code>Four</code></div>
                    </a>
                    <div className="menu-end">
                        <a href="/a-star"><div className="menu-elem"><code>Five</code></div></a>
                    </div>
                </div>
            </body>
    );
};

export default IndexPage;
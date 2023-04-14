//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

$(document).ready(function () {
    setTimeout(() => {
        let top_pos = (window.innerHeight/2-parseInt($("#back_logo").css("height"))/2);
        $("#back_logo").css("top", top_pos);
        setTimeout(() => {
            $("#back_logo").addClass("glitched");
    
            setTimeout(() => {
                $("#back_logo").removeClass("glitched");
    
                setTimeout(() => {
                    $("#back_logo").addClass("glitchedT2");
    
                    setTimeout(() => {
                        $("#back_logo").removeClass("glitchedT2");
                        $("#back_logo").addClass("glitched");

                        setTimeout(() => {
                            $("#back_logo").removeClass("glitched");

                            setTimeout(() => {
                                $("#back_logo").addClass("glitched");
                                setTimeout(() => {
                                    $("#back_logo").removeClass("glitched");
                                    $("#back_logo").addClass("glitchedT2");
                                    setTimeout(() => {
                                        $("#back_logo").removeClass("glitchedT2");
                                        $("#back_logo").addClass("glitched");
                                        setTimeout(() => {
                                            $("#back_logo").removeClass("glitched");
                                            $("#back_logo").css("display", "none");
                                            $("#back_load").css("display", "none");
                                        }, 70);
                                    }, 50);
                                }, 100);
                            }, 80);
                            
                        }, 200);

                    }, 300);
    
                }, 300);
    
            }, 100);
    
        }, 500);
    }, 50);
    

    $(".logo").mousedown(function () { 
        $("#back_logo").css("display", "block");
        $("#back_load").css("display", "block");
        
        setTimeout(() => {
            $("#back_logo").addClass("glitchedT2");
    
            setTimeout(() => {
                $("#back_logo").removeClass("glitchedT2");
    
                setTimeout(() => {
                    $("#back_logo").addClass("glitched");
    
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 100);
    
                }, 600);
    
            }, 100);
    
        }, 100);
    });
});
/**
 * Created by alone on 17-5-12.
 */
"use strict";
export default {
    /**
     * 获取浏览器高度
     * @returns {number}
     */
    getWindowHeight() {
        let winHeight = 0;
        if (window.innerHeight){
            winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)){
            winHeight = document.body.clientHeight;
        }
        return winHeight;
    }
}
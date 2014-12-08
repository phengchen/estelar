/**
 * Created by Administrator on 2014/12/6.
 * 背景层
 */

var BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.winSize;

        //create the background image and position it at the center of screen
        var centerPos = cc.p(winsize.width / 2, winsize.height / 2);
        var spriteBG = new cc.Sprite(res.Background);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);
    }
});
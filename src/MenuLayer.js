/**
 * Created by daisy on 14/12/6.
 */

var MenuLayer = cc.Layer.extend({
    _leftButton:null,
    _rightButton: null,
    _switchButton: null,
    _soundButton: null
    ,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        var size = cc.winSize;


        // add menu
        //_leftButton = new cc.MenuItemImage(res.ZuoBtn_png,res.ZuoBtn_png,this.onMenuLeftButtonCallback, this);
        //_leftButton.attr({
        //    x: 100,
        //    y: 100,
        //    anchorX: 0.5,
        //    anchorY: 0.5,
        //    scale: 0.8
        //
        //});
        //
        //_rightButton = new cc.MenuItemImage(res.YouBtn_png,res.YouBtn_png,this.onMenuRightButtonCallback, this);
        //
        //_rightButton.attr({
        //    x: size.width - 100,
        //    y: 100,
        //    anchorX: 0.5,
        //    anchorY: 0.5,
        //    scale: 0.8
        //
        //});

        this._switchButton = new cc.MenuItemImage(res.PauseBtn_png, res.StartBtn_png, this.onMenuSwitchButtonCallback, this);
        this._switchButton.attr({
            x: size.width - 150,
            y: size.height - 50,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 0.8

        });

        this._soundButton = new cc.MenuItemImage(res.NoiseBtn_png, res.NoiselessBtn_png, this.onMenuSoundButtonCallback, this);
        this._soundButton.attr({
            x: size.width - 80 ,
            y: size.height - 50,
            anchorX: 0.5,
            anchorY: 0.5,
            scale: 0.8

        });
        var menu = new cc.Menu(this._switchButton, this._soundButton);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);


        return true;
    },

    onMenuLeftButtonCallback:function(){

    },

    onMenuRightButtonCallback:function(){

    },

    onMenuSwitchButtonCallback:function(){
        if(!cc.director.isPaused())
        {
            cc.director.pause();
            this._switchButton.setNormalSpriteFrame(res.StartBtn_png);
            this._switchButton.setSelectedSpriteFrame(res.PauseBtn_png);
        }
        else
        {
            cc.director.resume();
            this._switchButton.setNormalSpriteFrame(res.PauseBtn_png);
            this._switchButton.setSelectedSpriteFrame(res.StartBtn_png);
        }
    },

    onMenuSoundButtonCallback:function(){

        var status = cc.audioEngine.isMusicPlaying();
        if(status)
        {
            cc.audioEngine.pauseMusic();
            this._soundButton.selected();


        }
        else
        {
            cc.audioEngine.resumeMusic();
            this._soundButton.unselected();

        }

    }



});
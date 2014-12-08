/**
 * Created by daisy on 14/12/6.
 */



var GameMainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        //add background
//        var centerpos = cc.p(_winSize.width / 2, _winSize.height / 2);
//        var spritebg =  cc.Sprite.create(res.Background);
//        spritebg.setPosition(centerpos);
//        this.addChild(spritebg);
        var backgroundLayer = new BackgroundLayer();
        this.addChild(backgroundLayer);

        var menuLayer = new MenuLayer();
        this.addChild(menuLayer,1);

        var loginlayer = new LoginLayer();
        this.addChild(loginlayer,2);

//        var resultLayer = new ResultLayer(true);
//        this.addChild(resultLayer,2);






    }
});
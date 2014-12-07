/**
 * Created by lizhiyi on 2014/12/6.
 * 游戏战斗主场景
 */

var PlayScene = cc.Scene.extend({
    space:null,
    spacecraftBody:null,
    onEnter:function () {
        this._super();

        this.initPhysics();

        this.addChild(new BackgroundLayer(), 0, TagOfLayer.background);

        var layerAni = new AnimationLayer(this.space);
        this.addChild(layerAni, 1, TagOfLayer.Animation);

        this.addChild(new StatusLayer(), 2, TagOfLayer.Status);

        this.addChild(new MenuLayer(), 3, TagOfLayer.Menu);

        layerAni.initPowerProgress();

        this.scheduleUpdate();
    },
    initPhysics : function() {
        this.space = new cp.Space();
        this.setupDebugNode();
    },
    setupDebugNode : function()
    {
        // debug only
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true ;
        this.addChild( this._debugNode );
    },
    showResult: function (bWin) {
        //撞到门啦，，赢了
        if(bWin)
        {
            cc.log("you win");
        }
        else
        {
            cc.log("you lose");
        }

        //cc.director.pause();
        var resultLayer = new ResultLayer(bWin);
        this.addChild(resultLayer, 10, TagOfLayer.Result);
    },
    update : function(dt)
    {
        this.space.step(dt);
    }
});
/**
 * Created by daisy on 14/12/7.
 */
/**
 * Created by daisy on 14/12/6.
 */

var ResultLayer = cc.Layer.extend({
    _result: false,
    _timer: 0,

    ctor:function (result) {
        //////////////////////////////
        // 1. super init first
        this._super();

        var winSize = cc.winSize;
        this._result = result;

        //add background
        var centerpos = cc.p(winSize.width / 2, winSize.height / 2);
        var background =  cc.Sprite.create(res.LayerBG_png);
        background.setPosition(centerpos);
        background.setScale(0.8);
        this.addChild(background);

        var labelRes, normalBtnRes,selectBtnRes ;
        if(result){
            labelRes = res.YouWinLabel_png;
            normalBtnRes = res.NextNormalBtn_png;
            selectBtnRes = res.NextNormalBtn_png;
        }
        else{
            labelRes = res.YouLoseLabel_png;
            normalBtnRes = res.AgainNormalBtn_png;
            selectBtnRes = res.AgainNormalBtn_png;
        }


        //add label
        var label =  cc.Sprite.create(labelRes);
        label.x = winSize.width / 2;
        label.y = winSize.height / 2.5;
        label.setScale(0.4);
        this.addChild(label);


        // add again button
        var againButton = new cc.MenuItemImage(
            normalBtnRes,
            selectBtnRes,
            this.onMenuCallback, this);
        againButton.attr({
            x: 0,
            y: -130,
            scale:0.27
        });

        var menu = new cc.Menu(againButton);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2;
        this.addChild(menu);

        return true;
    },

    onMenuCallback:function(){
        if(this._result){
            //win
            var honors  = DataManager._getInstance().getMapInfo().data.honors;
            var roleInfo = DataManager._getInstance().getRoleInfo();
            RequestManager._getInstance().passLevelAction(
                roleInfo.user_id,
                roleInfo.level,
                honors,
                function(str){

            });

            //add progress
            var progress = new ccui.LoadingBar(res.Progress_png);
            progress.setPercent(0);
            this.addChild(progress,3);
            progress.x = _winSize.width / 2;
            progress.y = _winSize.height / 6;

            this._progressBar = progress;
            this.scheduleUpdate();

        }else{
            //lose

            this.removeFromParent();

            cc.director.resume();
            cc.director.runScene(new PlayScene());
        }
    },

    update:function(dx){

        var info = DataManager._getInstance().getReadyStatus();

        var progress = this._progressBar;
        if(progress != null){
            this._timer ++;
            if(progress.getPercent() < 90 && this._timer%5 == 0)
            {
                this._timer = 0;
                progress.setPercent(progress.getPercent() + 4);
            }else if(progress.getPercent() >= 90 && info == 1){
                //ready
                progress.setPercent(100);
                this.removeAllChildren();
                this.removeFromParent();
                cc.director.resume();
                cc.director.runScene(new PlayScene());

            }
            if(progress.getPercent() >= 90 && DataManager._getInstance().getNetInfo().code != 200)
            {
                this.getParent().addChild(new TipsLayer(DataManager._getInstance().getNetInfo().message),5);
                this.removeChild(progress);
                this.unscheduleUpdate();
            }
        }
    }
});
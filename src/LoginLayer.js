/**
 * Created by daisy on 14/12/6.
 */


var LoginLayer = cc.Layer.extend({
    _trackNode:null,
    _winSize:null,
    _progressBar:null,
    _timer: 0
    ,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();


        _winSize = cc.winSize;

        //add background
        var centerpos = cc.p(_winSize.width / 2, _winSize.height / 2);
        var spritebg =  cc.Sprite.create(res.LayerBG_png);
        spritebg.setPosition(centerpos);
        spritebg.setScale(0.8);
        this.addChild(spritebg);


        // add login button
        var loginButton = new cc.MenuItemImage(
            res.PlayBtn_png,
            res.PlayBtn_png,
            this.onMenuCallback, this);
        loginButton.setScale(0.7);

        var menu = new cc.Menu(loginButton);
        menu.x = _winSize.width / 2;
        menu.y = _winSize.height / 2.5;
        this.addChild(menu);


//        //add sprite "name"
        var nameSprite = cc.Sprite.create(res.NameLabel_png);
        nameSprite.attr({
            x:_winSize.width / 2 - 60,
            y:_winSize.height / 2 - 120,
            scale:0.8
        });
        this.addChild(nameSprite);

        //add sprite "editbg"
        var editSprite = cc.Sprite.create(res.EditBG_png);
        editSprite.attr({
            x:_winSize.width / 2 + 50,
            y:_winSize.height / 2 - 120,
            scale:0.6
        });
        this.addChild(editSprite);

        //add testfield
//        var textField= new ccui.TextField();
//        textField.fontName = "Marker Felt";
//        textField.setMaxLength(10);
//        textField.setMaxLengthEnabled(true);
//        textField.setTextColor(cc.color("e4f2fe"));
//        textField.placeHolder = "input name";
//        textField.widthSize = 100;
//
//        textField.setPosition(editSprite.getPosition().x,editSprite.getPosition().y);
//
//        this.addChild(textField,2);
//
//        this._trackNode = textField;

        var editBox = new cc.EditBox(cc.size(149, 42), new cc.Scale9Sprite(res.EditBG_png));
        editBox.attr({
            x:_winSize.width / 2 + 50,
            y:_winSize.height / 2 - 120,
            scale:0.6
        });
        editBox.setFontColor(cc.color("#e4f2fe"));
        editBox.setFontSize(20);
        editBox.setFontName("Marker Felt");
        editBox.setPlaceHolder("  input name");

        this.addChild(editBox,2);
        this._trackNode = editBox;

        this._trackNode = editBox;

        var label =  new cc.LabelTTF("Power By Cocos2d-JS");
        label.x = 0;
        label.y = 0;
        label.setFontSize(18);
        label.setAnchorPoint(cc.p(0,0));
        this.addChild(label);

        return true;
    },

    onMenuCallback:function(){
        var textField= this._trackNode;
        var text = textField.getString();
        if(text == "") return;
        cc.log(textField.getString());
        RequestManager._getInstance().loginAction(this._trackNode.getString(),function(str){

        });

        //add progress
        var progress = new ccui.LoadingBar(res.Progress_png);
        progress.setPercent(0);
        this.addChild(progress,3);
        progress.x = _winSize.width / 2;
        progress.y = _winSize.height / 6;

        this._progressBar = progress;
        this.scheduleUpdate();
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
                //login success
                progress.setPercent(100);
                this.removeAllChildren();
                this.removeFromParent();
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
/**
 * Created by Administrator on 2014/12/6.
 * 状态层
 */

var StatusLayer = cc.Layer.extend({
    lbPower:null,
    leftSprite:null,
    rightSprite:null,
    powerSprite:null,
    powerProgress:null,
    powerProgressBg:null,
    m_minPower:0,
    m_maxPower:50,
    m_centerPower:10,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();



        var winSize = cc.winSize;
        // add menu
        this.leftSprite = new cc.Sprite(res.ZuoBtn_png);
        var leftContentSize = this.leftSprite.getContentSize();
        this.addChild(this.leftSprite);
        this.leftSprite.setPosition(cc.p(leftContentSize.width/2 + 80, leftContentSize.height - 20));
        this.leftSprite.setScale(0.7);

        //
        this.rightSprite = new cc.Sprite(res.YouBtn_png);
        var rightContentSize = this.rightSprite.getContentSize();
        this.addChild(this.rightSprite);
        this.rightSprite.setPosition(cc.p(winSize.width - rightContentSize.width/2 - 80, rightContentSize.height - 20));
        this.rightSprite.setScale(0.7);

        var lv = DataManager._getInstance().getRoleInfo().level;
        var roleInfo = DataManager._getInstance().getRoleInfo();
        if(lv == 1)
        {
            this.leftSprite.setVisible(true);
            this.rightSprite.setVisible(true);
        }
        else
        {
            this.leftSprite.setVisible(false);
            this.rightSprite.setVisible(false);
        }

        this.lbPower = new cc.LabelTTF("Level:" + lv + "    Rank:" + roleInfo.rank + "    Honors:" + roleInfo.honors);
        this.lbPower.setFontSize(18);
        this.lbPower.setColor(cc.color(255,255,255));
        this.lbPower.setPosition(cc.p(winSize.width/2, winSize.height - 30));
        this.addChild(this.lbPower);

        var lbDesc = new cc.LabelTTF("Tap right screen to accelerate, tap left to slow down!");
        lbDesc.setFontSize(18);
        lbDesc.setColor(cc.color(255,255,255));
        lbDesc.setPosition(cc.p(winSize.width/2, winSize.height - 50));
        this.addChild(lbDesc);

        var fScalePower = 0.2;
        this.powerProgressBg = new cc.Sprite(res.powerProBg_png);
        this.powerProgressBg.setScale(fScalePower);
        var contentPowerProSize = this.powerProgressBg.getContentSize();
        this.powerProgressBg.setPosition(winSize.width/2, contentPowerProSize.height * fScalePower + 10);
        this.addChild(this.powerProgressBg);

        this.powerProgress = new cc.Sprite(res.powerPro_png);
        this.powerProgress.setScale(fScalePower);
        this.powerProgress.setPosition(winSize.width/2, contentPowerProSize.height * fScalePower + 10);
        this.addChild(this.powerProgress);

        this.powerSprite = new cc.Sprite(res.powerProSprite_png);
        this.powerSprite.setScale(fScalePower);
        var contentSprite = this.powerSprite.getContentSize();
        this.powerSprite.setPosition(winSize.width/2, contentPowerProSize.height * fScalePower + contentSprite.height * fScalePower);
        this.addChild(this.powerSprite);

    },
    setBtnVisible: function (bShow) {
        this.leftSprite.setVisible(bShow);
        this.rightSprite.setVisible(bShow);
    },
    setPowerRange:function(minPower, maxPower, startPower){
        this.m_minPower = minPower;
        this.m_maxPower = maxPower;
        this.m_centerPower = startPower;
    },
    setPower:function(power){
        //this.lbPower.string = "Power:" + power;
        var width = this.powerProgressBg.getContentSize().width/2 * 0.2;
        if(power > this.m_centerPower)
        {
            //处于加速阶段
            var length = this.m_maxPower - this.m_centerPower;
            var fWidthPerLength = width/length;
            var posX = (power - this.m_centerPower)*fWidthPerLength;
            posX = posX + cc.winSize.width/2;

            this.setProgress(posX);
        }
        else
        {
            //处于减速阶段
            var length = this.m_centerPower - this.m_minPower;
            var fPowerWidthPerLength = width/length;
            var posMinusX = (power - this.m_centerPower)*fPowerWidthPerLength;
            posMinusX = posMinusX + cc.winSize.width/2;

            this.setProgress(posMinusX);
        }
    },
    setProgress: function (value) {
        this.powerSprite.setPositionX(value);
        this.powerProgress.setPositionX(value);
    }
});
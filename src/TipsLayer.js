/**
 * Created by daisy on 14/12/6.
 */

var TipsLayer = cc.Layer.extend({

    ctor:function (msg) {
        //////////////////////////////
        // 1. super init first
        this._super();


        var size = cc.winSize;
        var  sp = new cc.Sprite();
        sp.setPosition(size.width/2, size.height/4);
        sp.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(this.onEnd, this)));
        this.addChild(sp,10);

        var tf = new cc.LabelTTF(msg, "Arial", 20);
        tf.setPosition(size.width/2, size.height/4);

        tf.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(tf,10);

        return true;
    },

    onEnd:function(){
        this.removeAllChildren();
        this.removeFromParent();
    }


});
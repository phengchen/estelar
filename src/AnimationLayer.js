/**
 * Created by Administrator on 2014/12/6.
 * 动画层
 */

var bPrePlant = false;      //上一帧是否触碰星球
var bClosePlant = false;    //当前是否触碰星球
var gameLayer = null;       //AnimationLayer

var AnimationLayer = cc.Layer.extend({
    space:null,
    bTouchAdd:false,
    bTouchMinus:false,
    nTouchFrame:0,
    _drawNode:null,
    spacecraft:null,            //飞船
    fScaleSpacecraft:0.02,      //飞船比例
    posSpacecraft:cc.p(20,20),  //飞船起飞点
    aryPlant:null,              //星球数组
    posDoor:cc.p(1100,100),     //门的位置
    nStartPower:10,             //起始能量
    nCraftPower:10,             //当前能量
    nMaxPower:60,               //能量上限
    nMinPower:0,                //能量下限
    nPowerPerAdd:2,             //每次能量递增数
    nPowerPerMinus:2,           //每次能量递减数
    nFriction:10,               //摩擦力
    startSpeed:50,              //飞船起始速度
    minSpeed:10,                //最小飞行速度
    maxSpeed:150,               //最大飞行速度
    fScaleGravity:2,            //星球引力倍数
    bClockwise:true,            //是否为顺时针
    bTouchWin:false,            //是否触碰到门
    _curGravityForce:cc.p(0,0), //当前星球引力为多少
    _curFriction:cc.p(0,0),     //当前摩擦力
    _curPower:cc.p(0,0),        //当前推动力
    curSpeed:50,
    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
        this.addWall();
        this.addPlant();
        this.addSpacecraft();

        this.addDoor();

        var onTouchBegan = this.onTouchBegan;
        var onTouchEnded = this.onTouchEnded;
        cc.eventManager.addListener(cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan : function(touch, event) {
                onTouchBegan(touch, event);
                return true;
            },
            onTouchEnded: function(touch, event){
                onTouchEnded(touch,event);
                return false;
            },
            onTouchCancelled : function(touch, event) {
                cc.log("cancel");
                return false;
            }
        }), this);

        cc.eventManager.addListener(cc.EventListener.create({
            event : cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var target = event.getCurrentTarget();
                if(keyCode == cc.KEY.left)
                {
                    if(!target.bTouchAdd) {
                        target.bTouchMinus = true;
                    }
                }
                else if(keyCode == cc.KEY.right)
                {
                    if(!target.bTouchMinus)
                    {
                        target.bTouchAdd = true;
                    }
                }
            },
            onKeyReleased: function(keyCode, event){
                var target = event.getCurrentTarget();
                if(keyCode == cc.KEY.left)
                {
                    target.bTouchMinus = false;
                }
                else if(keyCode == cc.KEY.right)
                {
                    target.bTouchAdd = false;
                }
                cc.log("release");
            }
        }), this);

        this._drawNode = new cc.DrawNode();
        this.addChild(this._drawNode, 10);

        this.scheduleUpdate();

        gameLayer = this;
    },
    initPowerProgress:function()
    {
        var StatusLayer = this.getParent().getChildByTag(TagOfLayer.Status);
        StatusLayer.setPowerRange(this.nMinPower, this.nMaxPower, this.nCraftPower);
    },
    showMap:function(idxMap){

    },
    onTouchBegan:function(touch ,event){
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());

        var winSize = cc.winSize;
        if(locationInNode.x < winSize.width/2)
        {
            target.bTouchMinus = true;

            cc.log("slow_mp3");
            cc.audioEngine.stopAllEffects();
            cc.audioEngine.playEffect(res.slow_mp3, true);
        }
        else
        {
            target.bTouchAdd = true;

            cc.log("go1_mp3");
            cc.audioEngine.stopAllEffects();
            cc.audioEngine.playEffect(res.go1_mp3, true);
        }
    },
    onTouchEnded:function(touch ,event){
        cc.log("onTouchEnd");
        var target = event.getCurrentTarget();

        target.bTouchAdd = false;
        target.bTouchMinus = false;
        target.nTouchFrame = 0;
        target.nCraftPower = target.nStartPower - 0.2;
        cc.audioEngine.stopAllEffects();
        cc.log("stop");
        cc.log("end");
    },
    init:function () {
        this._super();

    },
    addWall:function(){
        var staticBody = this.space.staticBody;

        var winSize = cc.winSize;
        // Walls
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(winSize.width,0), 0 ),               // bottom
            new cp.SegmentShape( staticBody, cp.v(0,winSize.height), cp.v(winSize.width,winSize.height), 0),    // top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),             // left
            new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0)  // right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this.space.addStaticShape( shape );
            shape.setCollisionType(CollisionType.wall);
        }

        // Gravity
        //this.space.gravity = cp.v(0, -100);
    },
    addDoor:function(){
        var itemInf = null;
        var mapInfo = DataManager._getInstance().getMapInfo().data.sprites;
        for(var item in mapInfo)
        {
            var type = mapInfo[item].type;
            if (type == TypeOfGameObj.door) {
                itemInf = mapInfo[item];
                break;
            }
        }

        if(itemInf == null)
        {
            //Data error
            cc.log("Data error");
            return;
        }
        this.posDoor.x = itemInf.x;
        this.posDoor.y = itemInf.y;

        var fScale = itemInf.a;
        var door = new cc.PhysicsSprite(res.ship_png);
        door.setScale(fScale);

        var content = door.getContentSize();
        var width = content.width * fScale*0.6;
        var height = content.height * fScale*0.6;
        var mass = 1;
        var moment = cp.momentForBox(mass, width, height);

        var doorBody = this.space.addBody( new cp.Body(mass, moment));
        doorBody.setPos( cp.v(this.posDoor.x, this.posDoor.y));

        var shape = this.space.addStaticShape( new cp.BoxShape(doorBody, width, height));
        shape.setFriction(0.1);
        shape.setElasticity(0.2);
        shape.setCollisionType(CollisionType.door);

        door.setBody(doorBody);
        this.addChild(door);
        //this.space.addBody(spacecraftBody);
    },
    addSpacecraft:function()
    {
        var itemInf = null;
        var mapInfo = DataManager._getInstance().getMapInfo().data.sprites;
        for(var item in mapInfo)
        {
            var type = mapInfo[item].type;
            if (type == TypeOfGameObj.player) {
                itemInf = mapInfo[item];
                break;
            }
        }

        if(itemInf == null)
        {
            //Data error
            cc.log("Data error");
            return;
        }
        this.posSpacecraft.x = itemInf.x;
        this.posSpacecraft.y = itemInf.y;


        this.spacecraft = new cc.PhysicsSprite(res.spacecraft_png);
        this.spacecraft.setScale(this.fScaleSpacecraft);
        var contentSize = this.spacecraft.getContentSize();
        var width = contentSize.width*this.fScaleSpacecraft;
        var height = contentSize.height*this.fScaleSpacecraft;
        var mass = 1.2;
        var moment = cp.momentForBox(mass, width, height);
        var spacecraftBody = this.space.addBody( new cp.Body(mass, moment));
        spacecraftBody.setPos( cp.v(this.posSpacecraft.x, this.posSpacecraft.y));
        spacecraftBody.setVel( cp.v(itemInf.r, itemInf.R));

        var shape = this.space.addShape( new cp.BoxShape(spacecraftBody, width, height));
        shape.setFriction(0.1);
        shape.setElasticity(0.2);
        shape.setCollisionType(CollisionType.player)

        this.spacecraft.setBody(spacecraftBody);

        this.addChild(this.spacecraft, ZorderOfObj.spacecraft);
    },
    addPlant:function()
    {
        //创建星球
        var mapInfo = DataManager._getInstance().getMapInfo().data.sprites;
        for(var item in mapInfo)
        {
            var type = mapInfo[item].type;
            if(type != TypeOfGameObj.plant)
            {
                continue
            }

            var posPlantX = mapInfo[item].x;
            var posPlantY = mapInfo[item].y;
            var rPlant = mapInfo[item].r;
            var rRoom = mapInfo[item].R;
            var pic = mapInfo[item].pic;


            var roomSprite = new cc.PhysicsSprite(res.room01_png);
            var contentRoom = roomSprite.getContentSize();
            var scaleRoom = rRoom*2/contentRoom.width;
            roomSprite.setScale(scaleRoom);
            var body = this.space.addBody(new cp.Body(1, cp.momentForCircle(1, 0, rRoom, cp.v(0,0))));
            body.setPos(cp.v(posPlantX, posPlantY));

            var plantSprite = new cc.Sprite(res[pic]);
            var contentPlant = plantSprite.getContentSize();
            var scalePlant = rPlant*2/contentPlant.width;
            plantSprite.setScale(scalePlant);
            plantSprite.setPosition(cc.p(posPlantX, posPlantY));
            this.addChild(plantSprite);

            var shape = this.space.addStaticShape(new cp.CircleShape(body, rRoom, cp.v(0,0)));
            shape.setElasticity(0);
            shape.setFriction(0.9);
            shape.setCollisionType(CollisionType.plant);
            roomSprite.setBody(body);

            this.addChild(roomSprite, ZorderOfObj.plant);
        }
    },
    onEnter: function () {
        this._super();
        this.space.addCollisionHandler( CollisionType.wall, CollisionType.player, null, this.onTouchWall, null, null);
        this.space.addCollisionHandler( CollisionType.player, CollisionType.plant, null, this.onTouchPlant, null, null);
        this.space.addCollisionHandler( CollisionType.player, CollisionType.door, null, this.onTouchDoor, null, null);
    },
    onTouchDoor:function(arb, space, ptr){
        cc.log("collsion door");

        gameLayer.bTouchWin = true;

        return false;
    },
    onTouchWall:function(arb, space, ptr){
        cc.log("collsion");

        cc.log(gameLayer.bTouchWin);
        gameLayer.showResult.call(gameLayer,gameLayer.bTouchWin);

        //var shapes = arb.getShapes();
        //var wall = shapes[0];
        //var player = shapes[1];
        //
        //var bodyPlayer = player.getBody();
        //var pos = bodyPlayer.getPos();
        //var vel = bodyPlayer.getVel();
        //if(pos.x < 0)
        //{
        //    pos.x = cc.winSize.width;
        //    bodyPlayer.setPos();
        //}

        return false;
    },
    showResult:function(bWin){
        this.getParent().showResult(bWin);
    },
    onTouchPlant:function(arb, space, ptr){
        //cc.log("onTouchPlant");

        if(!bClosePlant)
        {
            bClosePlant = true;
        }

        var shapes = arb.getShapes();
        var player = shapes[0];
        var plant = shapes[1];

        //kg单位
        var mPlantGravity = gameLayer.fScaleGravity*6.672*(5.515 * plant.r*Math.PI*4/3)/1000;

        var bodyPlayer = player.getBody();
        var posPlayer =  bodyPlayer.getPos();
        var bodyPlant = plant.getBody();
        var posPlant = bodyPlant.getPos();

        var offsetX = posPlayer.x - posPlant.x;
        var offsetY = posPlayer.y - posPlant.y;


        var angle = cc.degreesToRadians(90);
        if(offsetX)
        {
            var posOffset = offsetY/offsetX;
            posOffset = Math.abs(posOffset);
            angle = Math.atan(posOffset);
        }

        //bodyPlayer.resetForces();

        var x = mPlantGravity*Math.cos(angle);
        var y = mPlantGravity*Math.sin(angle);

        if(offsetX > 0 && offsetY > 0)
        {
            //第一象限
            x = -x;
            y = -y;
        }
        else if(offsetX < 0 && offsetY > 0)
        {
            //第二象限
            y = -y;
        }
        else if(offsetX < 0 && offsetY < 0)
        {
            //第三象限
        }
        else if(offsetX > 0 && offsetY < 0)
        {
            //第四象限
            x = -x;
        }

        gameLayer._curGravityForce = cc.p(x, y);

        //bodyPlayer.applyForce(cp.v(x ,y), cp.v(0,0));

        //计算与引力垂直的力
        var posVel = bodyPlayer.getVel();//获得飞行速度向量
        if(bPrePlant == false)
        {
            //第一次进入引力圈
            if(posVel.x < 0)
            {
                //逆时针旋转
                gameLayer.bClockwise = false;
            }
            else
            {
                //顺时针旋转
                gameLayer.bClockwise = true;
            }
        }

        //垂直于重力的动力
        var lengthGrivity = Math.sqrt(x*x + y*y);
        var force = gameLayer.nCraftPower;
        var ratio = force/lengthGrivity;
        var velPow = cp.v(y*ratio, x*ratio);
        if(gameLayer.bClockwise)
        {
            velPow = cp.v(y*ratio, -x*ratio);
        }
        else
        {
            velPow = cp.v(-y*ratio, x*ratio);
        }

        gameLayer._curPower = cc.p(velPow.x, velPow.y);
        //bodyPlayer.applyForce(velPow, cp.v(0,0));

        //摩擦力
        var speed = bodyPlayer.getVel();
        var speedLength = Math.sqrt(speed.x*speed.x + speed.y*speed.y);
        var nFriction = speedLength/3;
        ratio = nFriction/speedLength;
        var velFriction = cp.v(-speed.x*ratio, - speed.y*ratio);
        //bodyPlayer.applyForce(velFriction, cp.v(0,0));
        gameLayer._curFriction = cc.p(velFriction.x, velFriction.y);


        //当小于某个距离表示装上了，停止下来,暂时注释
        var distance =  cc.pDistance(posPlayer, posPlant);
        //if(distance < 50)
        //{
        //    bodyPlayer.resetForces();
        //    bodyPlayer.setVel(cp.v(0,0));
        //}

        return false;
    },
    update:function(dt){
        if(this.bTouchAdd || this.bTouchMinus)
        {
            this.nTouchFrame++;
            if(this.nTouchFrame%10 == 9)
            {
                //this.nTouchFrame = 0;
                var StatusLayer = this.getParent().getChildByTag(TagOfLayer.Status);
                if(this.bTouchAdd)
                {
                    this.nCraftPower += this.nPowerPerAdd;
                    if(this.nCraftPower > this.nMaxPower)
                    {
                        this.nCraftPower = this.nMaxPower;
                    }

                }
                else if(this.bTouchMinus)
                {
                    this.nCraftPower -= this.nPowerPerMinus;
                    if(this.nCraftPower < this.nMinPower)
                    {
                        this.nCraftPower = this.nMinPower;
                    }
                }

                StatusLayer.setPower(this.nCraftPower);
            }
        }
        else
        {
            var StatusLayer = this.getParent().getChildByTag(TagOfLayer.Status);

            if(StatusLayer != null)
            {
                StatusLayer.setPower(this.nCraftPower);
            }
        }


        if(bPrePlant != bClosePlant && bPrePlant == true)
        {
            //刚刚离开(即第一次离开，清除所有力相关数据)
            this._curGravityForce = cc.p(0,0);
            this._curPower = cc.p(0,0);
            this._curFriction = cc.p(0,0);
            //var BodySpacecraft = this.spacecraft.getBody();
            //BodySpacecraft.resetForces();
        }
        bPrePlant = bClosePlant;

        var BodySpace = this.spacecraft.getBody();
        var vel = BodySpace.getVel();

        if(!bClosePlant && this.spacecraft != null)
        {
            //无引力情况下，只考虑动力和摩擦力
            var lengthBody = Math.sqrt(vel.x*vel.x +vel.y*vel.y);
            var ratioPower = this.nCraftPower/lengthBody;
            var ratioFriction = this.nFriction/lengthBody;
            this._curPower = cc.p(vel.x*ratioPower, vel.y*ratioPower);
            this._curFriction = cc.p(-vel.x*ratioFriction, -vel.y*ratioFriction);
            //Body.resetForces();
            //Body.applyForce(velPow, cp.v(0,0));
            if(this.nCraftPower < this.nFriction && lengthBody < this.minSpeed)
            {
                this.nCraftPower = this.nStartPower;
                this._curPower = cc.p(0,0);
                this._curFriction = cc.p(0,0);
                //Body.resetForces();
            }
            if(lengthBody > this.maxSpeed && this.nCraftPower > this.nFriction)
            {
                //如果速度大于最大速度，并且能量正在推进的时候，只为最大速度
                this._curPower = cc.p(0,0);
                this._curFriction = cc.p(0,0);
                //Body.resetForces();
            }
        }
        else
        {
            bClosePlant = false;
        }

        //以下代码为渲染力的线，以及对物体进行力的详细赋值
        this._drawNode.clear();

        BodySpace.resetForces();
        var posStart = BodySpace.getPos();

        var posPower = cc.p(posStart.x + this._curPower.x, posStart.y + this._curPower.y);
        this._drawNode.drawSegment(posStart, posPower, 1, cc.color(255, 0, 0, 255));
        BodySpace.applyForce(cp.v(this._curPower.x, this._curPower.y), cp.v(0,0));

        var posGravity = cc.p(posStart.x + this._curGravityForce.x, posStart.y + this._curGravityForce.y);
        this._drawNode.drawSegment(posStart, posGravity, 1, cc.color(0, 255, 0, 255));
        BodySpace.applyForce(cp.v(this._curGravityForce.x, this._curGravityForce.y), cp.v(0,0));

        var posFriction = cc.p(posStart.x + this._curFriction.x, posStart.y + this._curFriction.y);
        this._drawNode.drawSegment(posStart, posFriction, 1, cc.color(0, 0, 255, 255));
        BodySpace.applyForce(cp.v(this._curFriction.x, this._curFriction.y), cp.v(0,0));

        var force = BodySpace.f;
        var posForce = cc.p(posStart.x + force.x, posStart.y + force.y);
        this._drawNode.drawSegment(posStart, posForce, 1, cc.color(255, 255, 0, 255));
    }
});
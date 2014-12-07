/**
 * Created by lizhiyi on 2014/12/5.
 */

if(typeof ZorderOfObj == "undefined") {
    var ZorderOfObj = {};
    ZorderOfObj.plant = 0;
    ZorderOfObj.spacecraft = 1;
};

if(typeof CollisionType == "undefined") {
    var CollisionType = {};
    CollisionType.wall = 0;
    CollisionType.player = 1;
    CollisionType.plant = 2;
    CollisionType.door = 3;
};

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.Status = 2;
    TagOfLayer.Menu = 3;
    TagOfLayer.Result = 4;
};

if(typeof TypeOfGameObj == "undefined") {
    var TypeOfGameObj = {};
    TypeOfGameObj.player = 1;//飞船
    TypeOfGameObj.plant = 2;//星球
    TypeOfGameObj.door = 3;//传送门（即母船）
    TypeOfGameObj.gold = 4;//金币
};
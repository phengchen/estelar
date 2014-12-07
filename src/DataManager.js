/**
 * Created by daisy on 14/12/6.
 */
/**
 * Created by daisy on 14/12/5.
 */
var DataManager = cc.Class.extend({
    _netInfo:{}, //网络信息状态
    _loginStatus:false,//登录状态
    _readyStatus: false,//地图网络加载状态
    _roleInfo:{},//用户信息
    _mapInfo:{},//地图信息
    _goodsInfo:{}//道具信息
    ,
    ctor:function(){

    },

    gameProsses:function(response){
        if(response == null) return false;
        var jsonData = JSON.parse(response);
        if(jsonData == null) return false;
        this._netInfo.code = jsonData["code"];
        this._netInfo.message = jsonData["message"];
        var action = parseInt(jsonData["action"]);
        if(action == null) return false;
        switch (action){
        case 100://register
        case 101://login
        case 102:{ //提交关卡信息
            this.onRoleData(jsonData["data"]);
//            var goods ={
//                1:-1,
//                2:2
//
//            };
//            var strGoods = JSON.stringify(goods);
//            RequestManager._getInstance().passLevelAction(
//                this._roleInfo.user_id,
//                this._roleInfo.level,
//                10,
//                100,
//                strGoods,
//                function(str){
//
//            });
            if(this._loginStatus)
            {
                RequestManager._getInstance().getMapAction(this._roleInfo.user_id,this._roleInfo.level,function(str){

                });

            }

//            RequestManager._getInstance().getGoodsAction(this._roleInfo.user_id,function(str){
//
//            });
            break;
        }
        case 104:{//获取关卡地图
            this.onMapData(jsonData["data"]);
            break;
        }
        case 105:{//获取道具信息
            this.onGoodsData(jsonData["data"]);
            break;
        }

        default :
            break;

        }
        return true;
    },

    /**
     * 解析玩家数据
     * @param data
     * @returns {boolean}
     */
    onRoleData:function(data){
        if(data == null) return false;
        var goodsData = data["goods"];
        if(goodsData != null){
            var goods = [];

            for(var item in goodsData){
                var goodsItem = {};
                var name = goodsData[item]["name"];
                goodsItem.name = name;

                var count = goodsData[item]["count"];
                goodsItem.count = count;

                var id = goodsData[item]["id"];
                goodsItem.id = id;
                goods[item] = goodsItem;

            };
        }

        var user = data["user"];
        if(user != null)  this._roleInfo.name = user;

        var user_id = data["user_id"];
        if(user_id != null)  this._roleInfo.user_id = user_id;

        var level = data["level"];
        if(level != null)  this._roleInfo.level = level;

        var golds = data["golds"];
        if(golds != null)  this._roleInfo.golds = golds;

        var honors = data["honors"];
        if(honors != null)  this._roleInfo.honors = honors;

        var rank = data["rank"];
        if(rank != null)  this._roleInfo.rank = rank;

        var email = data["email"];
        if(email != null)  this._roleInfo.email = email;

        var ext = data["ext"];
        if(ext != null)  this._roleInfo.ext = ext;

        this._roleInfo.goods = goods;
        this._loginStatus = true;
    },

    /**
     * 解析关卡地图信息
     * @param data
     */
    onMapData:function(data){
        if(data == null) return;
        var mapData = data["data"];
        var map = {};
        if(mapData != null)
        {
            var spritesData = mapData["sprites"];

            if(spritesData != null){
                var sprites = [];
                for(var item in spritesData){
                    var spritesItem = {};
                    var type = spritesData[item]["type"];
                    spritesItem.type = type;

                    var x = spritesData[item]["x"];
                    spritesItem.x = x;

                    var y = spritesData[item]["y"];
                    spritesItem.y = y;

                    var r = spritesData[item]["r"];
                    spritesItem.r = r;

                    var R = spritesData[item]["R"];
                    spritesItem.R = R;

                    var a = spritesData[item]["a"];
                    spritesItem.a = a;

                    var pic = spritesData[item]["pic"];
                    spritesItem.pic = pic;
                    sprites[item] = spritesItem;
                };
                map.sprites = sprites;
            }
            var honors = mapData["honors"];
            if(honors != null) map.honors = honors;
        }


        var name = data["name"];
        if(name != null)  this._mapInfo.name = name;

        var ext = data["ext"];
        if(ext != null)  this._mapInfo.ext = ext;

        this._mapInfo.data = map;
        this._readyStatus = true;
    },

    /**
     * 解析获取道具信息
     * @param data
     */
    onGoodsData:function(data){
        if(data == null) return;
        var goods = [];

        for(var item in data){
            var goodsItem = {};
            var name = data[item]["name"];
            goodsItem.name = name;

            var cost = data[item]["cost"];
            goodsItem.cost = cost;

            var id = data[item]["id"];
            goodsItem.id = id;

            var describe =  data[item]["describe"];
            goodsItem.describe = describe;

            var ext =  data[item]["ext"];
            goodsItem.describe = ext;
            goods[item] = goodsItem;
        }
        this._goodsInfo = goods;
    },

    getRoleInfo:function(){
        return this._roleInfo;
    },

    getLoginStatus:function(){
        return this._loginStatus;
    },

    getMapInfo:function(){
        return this._mapInfo;
    },

    getGoodsInfo:function(){
        return this._goodsInfo;
    },

    setReadyStatus:function(status){
        this._readyStatus = status;
    },

    getReadyStatus:function(){
        return this._readyStatus;
    },

    getNetInfo:function(){
        return this._netInfo;
    }

});

DataManager.sharedDirector = null;

DataManager._getInstance = function () {
    if (DataManager.sharedDirector == null) {
        DataManager.sharedDirector = new DataManager();
    }
    return DataManager.sharedDirector;
};
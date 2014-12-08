/**
 * Created by daisy on 14/12/6.
 */


var RequestManager = cc.Class.extend({
    ctor:function(){

    },

    /**
     * 登录请求
     * @param userName 角色名
     * @param returnFunc 回调值
     */
    loginAction:function(userName,returnFunc){

        var param = {
            user:userName
        };
        HttpManager._getInstance().sendGetRequest(param,resquest.LOGIN,function(str){
            cc.log("response : " + str);
            DataManager._getInstance().gameProsses(str);
            returnFunc(str);

        });
    },

    //
    /**
     * 提交关卡数据请求
     * @param userId 用户id
     * @param level  关卡值
     * @param honors 获得荣誉值
     * @param returnFunc 回调函数
     */
    passLevelAction:function(userId, level, honors, returnFunc){
        var param = {
            user_id:userId,
            level:level,
            honors:honors
        };
        HttpManager._getInstance().sendGetRequest(param,resquest.PASSLEVEL,function(str){
            cc.log("response : " + str);
            DataManager._getInstance().gameProsses(str);
            returnFunc(str);

        });
    },

    /**
     * 获取关卡地图信息
     * @param userId 用户ID
     * @param level 当前关卡值
     */
    getMapAction:function(userId,level){
        DataManager._getInstance().setReadyStatus(false);
        var param = {
            user_id:userId,
            level:level
        };
        HttpManager._getInstance().sendGetRequest(param,resquest.GETMAP,function(str){
            cc.log("response : " + str);
            DataManager._getInstance().gameProsses(str);

        });
    },

    /**
     * 获取所有道具信息
     * @param 用户ID
     */
    getGoodsAction:function(userId){

        var param = {
            user_id:userId
        };
        HttpManager._getInstance().sendGetRequest(param,resquest.GETGOODS,function(str){
            cc.log("response : " + str);
            DataManager._getInstance().gameProsses(str);

        });
    }

});

RequestManager.sharedDirector = null;

RequestManager._getInstance = function () {
    if (RequestManager.sharedDirector == null) {
        RequestManager.sharedDirector = new RequestManager();
    }
    return RequestManager.sharedDirector;
};
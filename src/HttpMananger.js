/**
 * Created by daisy on 14/12/5.
 */
var HttpManager = cc.Class.extend({
    ctor:function(){

    },
    sendGetRequest: function(param, url, returnFun) {
        var that = this;
        var xhr = cc.loader.getXMLHttpRequest();
        //set arguments with <URL>?xxx=xxx&yyy=yyy

        var urlParam = "";
        var index = 0;
        for(var key in param){
           if(urlParam == ""){
               urlParam += "?" + key + "=" + param[key];

           } else{
               urlParam += "&" + key + "=" + param[key];
           }

        }
        url += urlParam;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                returnFun(xhr.responseText);
            }
        };
        xhr.send();
    }

});

HttpManager.sharedDirector = null;

HttpManager._getInstance = function () {
    if (HttpManager.sharedDirector == null) {
        HttpManager.sharedDirector = new HttpManager();
    }
    return HttpManager.sharedDirector;
};
/**
 * Created by daisy on 14/12/5.
 */
var resquest = {
    LOGIN : "http://115.28.150.156:8080/user/login",
    PASSLEVEL : "http://115.28.150.156:8080/user/passlevel",
    GETMAP : "http://115.28.150.156:8080/user/getmap",
    GETGOODS : "http://115.28.150.156:8080/user/getgoods"
};

var g_request = [];
for (var i in resquest) {
    g_request.push(resquest[i]);
}
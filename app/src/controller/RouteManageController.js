/**
 * 编辑route.json
 * author: tangjun
 */
let fs = require("fs");
// 动态路由
var RouteManageController = {
    path : './app/config/route.json',
    app : null,

    show : function(req, res){
        let routes = {};
        try {
            routes = JSON.parse(fs.readFileSync(this.path), 'utf8');
            console.log("show routes"+JSON.stringify(routes));
        } catch (e) {
            console.log(e)
        }
        let data = {};
        data.layout = false;
        data.routes = routes;
        data.title = "查看已有线路";
        data.helper={
            isJSON:this.isJSON
        }
        res.render("index",data);
    },

    init : function(){
        if(!app){
            console.error("系统主参数App未设置");
            return false;
        }
        this.app = app;
        this.path = path?path:this.path;
    },

    updateRoute : function(req,res){
        let result = {};
        let that = this;
        try {
            let id = req.body.id;
            let url = req.body.url;
            let resp = req.body.resp;

            console.log("updateRoute id:" + id + ",url:" + url + ",resp:" + resp);
            let config = JSON.parse(fs.readFileSync(this.path), 'utf8');
            result.status = 1;
            if (config.routes) {
                config.routes.forEach(function (item) {
                    if (item.id == id) {
                        //replace route
                        item.url = url;
                        item.resp = that.isJSON(resp)?JSON.parse(resp):resp;
                    }
                    if(item.url == url && item.id != id){
                        throw  new Error("已有该URL的配置");
                    }
                })
                fs.writeFile(this.path, JSON.stringify(config), function (err) {
                    if (err) {
                        console.error(err);
                        result.status = 0;
                        result.message = err;
                    }
                })

                res.json(result);
            }
        } catch (e) {
            console.log(e)
            result.status = 0;
            result.message = e.message;
            res.json(result);
        }
    },

    addRoute : function(req,res){
        let result = {};
        let that = this;
        try {
            let url = req.body.addUrl;
            let resp = req.body.addResp;
            if (url == '' || resp == '') {
                res.redirect('/console/show')
            }
            console.log("addRoute " + ",url:" + url + ",resp:" + resp);
            let config = JSON.parse(fs.readFileSync(this.path), 'utf8');

            result.status = 1;

            if(config.routes == null ){
                config.routes = new Array();
            }

            if (config.routes) {
                let maxId = 0;
                config.routes.forEach(function (item) {
                    if (item.id >= maxId) {
                        maxId = item.id + 1;
                    }
                    if(item.url == url ){
                        throw  new Error("已有该URL的配置");
                    }
                })
                config.routes.push({"id":maxId,"url":url,"resp":that.isJSON(resp)?JSON.parse(resp):resp});
                console.log("now config:"+JSON.stringify(config))
            }
            fs.writeFile(this.path, JSON.stringify(config), function (err) {
                if (err) {
                    console.error(err);
                    result.status = 0;
                    result.message = err;
                }
            })
            res.json(result);
        } catch (e) {
            console.log(e)
            result.status = 0;
            result.message = e.message;
            res.json(result);
        }
    },

    delRoute : function(req,res){
        let id = req.query.id;

        console.log("id"+id);
        let routes = JSON.parse(fs.readFileSync(this.path), 'utf8');
        if(routes.routes){
            routes.routes.forEach(function(item,i,routes){
                if(item.id == id){
                    routes.splice(i, 1);
                }
            })
            fs.writeFile(this.path,JSON.stringify(routes),function(err){
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                res.redirect('/console/show')
            })
        }
    },

    isJSON : function (str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch(e) {
                console.log(e);
                return false;
            }
        }
        console.log(str+'It is not a string!')
    }
}

module.exports = RouteManageController;
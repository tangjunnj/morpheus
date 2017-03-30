/**
 * 动态遍历目录加载路由工具
 * author: tangjun
 */
var fs = require("fs");
//var removeRoute = require('express-remove-route');

// 动态路由
var DynamicRouteController = {
    path : '../../config/route.json',
    app : null,
    // 遍历目录
    parseRouteConfig : function(configf){
        var that = this;
        var config = JSON.parse(fs.readFileSync(configf), 'utf8');
        if( config && config.routes) {
            var routes = config.routes;

            routes.forEach(function(item){
                console.log("parseRouteConfig:"+JSON.stringify(item));
                that.app.route(item.url)
                    .all(function(req,res,next){
                        res.send(item.resp);
                        next();
                    })
            })
        }
    },
    // 初始化入口
    init : function(app,path){
        if(!app){
            console.error("系统主参数App未设置");
            return false;
        }
        this.app = app;
        this.path = path?path:this.path;
        this.parseRouteConfig(this.path);
    },
    //清空
    clear:function(req,res){
        console.log("now clear");
        var routes = this.app._router.stack;
        routes.forEach(removeMiddlewares);
        function removeMiddlewares(layer, i, routes) {
            console.log(layer.route);
            if(layer.route && layer.route.path){
                console.log(layer.route.path+", index"+layer.route.path.indexOf('/console'));
            }
            if(layer.route && layer.route.path && layer.route.path.indexOf('/console') != 0){
                routes.splice(i, 1);
            }
        }
        console.log("clear complete");
    },
    //刷新
    refresh:function(req,res){
        this.clear(req,res);
        this.init(this.app,this.path)
        res.redirect('/console/show')
    }

};

module.exports = DynamicRouteController;
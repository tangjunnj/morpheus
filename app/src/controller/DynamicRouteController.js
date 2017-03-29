/**
 * 动态遍历目录加载路由工具
 * author: tangjun
 */
var fs = require("fs");
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
                console.log(item);
                that.app.use(item.url,function(req,res){
                    res.json(JSON.parse(item.resp));
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
        function removeMiddlewares(route, i, routes) {
            if(route && route.path){
                console.log(route.path+", index"+route.path.indexOf('/console'));
            }
            if(route.path && route.path.indexOf('/console') != 0){
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
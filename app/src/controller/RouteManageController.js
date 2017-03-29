/**
 * 编辑route.json
 * author: tangjun
 */
var fs = require("fs");
// 动态路由
var RouteManageController = {
    path : './app/config/route.json',
    app : null,

    show : function(req, res){
        let routes = JSON.parse(fs.readFileSync(this.path), 'utf8');
        console.log(routes);
        let data = {};
        data.layout = false;
        data.routes = routes;
        data.title = "查看已有线路";
        res.render("../app/src/view/index",data);
    },

    init : function(){
        if(!app){
            console.error("系统主参数App未设置");
            return false;
        }
        this.app = app;
        this.path = path?path:this.path;
    },

    //TODO
    updateRoute : function(req,res){
        let id = req.query.id;

        console.log("id"+id);
        let routes = JSON.parse(fs.readFileSync(this.path), 'utf8');
        if(routes.routes){
            routes.routes.forEach(function(item,i,routes){
                if(item.id == id){
                    let route = routes.get(i);

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

    addRoute : function(req,res){
        console.log(req)
        let url = req.body.addUrl;
        let resp = req.body.addResp;
        if(url == '' || resp ==''){
            res.redirect('/console/show')
        }
        let routes = JSON.parse(fs.readFileSync(this.path), 'utf8');
        routes.routes.push();
        if(routes.routes){
            let maxId = 0;
            routes.routes.forEach(function(item,i,routes){
                if(item.id >= maxId){
                    maxId = item.id+1;

                }
            })
            routes.routes.push({"id":maxId,"url":url,"resp":resp});

            let result = {};
            result.status = 1;
            fs.writeFile(this.path,routes,function(err){
                if (err) {
                    console.error(err);
                    result.status = 0;
                    result.message = err;
                }
            })
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
    }
}

module.exports = RouteManageController;
var appRouter = function(app) {
    
    app.get("/", function(req, res) {
        
        console.log("Receive from web client ",req.query);
        var appInfo = {
            appID : '268585663526955',
            appSecret : 'b3e12bed580a0f3ae2f330525d85d908'
        };
        
        var options = {
            host: 'graph.facebook.com',
            path: "oauth/access_token?client_id=" + appInfo.appID + "&client_secret="+appInfo.appSecret +
            "&grant_type=fb_exchange_token&fb_exchange_token=" + req.query.accessToken
        };
        
        
        var request = require('request');
        var url = 'https://graph.facebook.com/' + options.path;
        console.log(url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Receive from FB",body); 
                
                var url2="http://tokenmanager:3000/newtoken?loginname=" + req.query.email + '&' + body;
                request(url2, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("Receive from Token Manager",body); 
                    }
                    else if (error){console.log(error);}
                });
                
                return res.send(body);
            }
            else if (error){console.log(error);}
        });
    });
}
 
module.exports = appRouter;
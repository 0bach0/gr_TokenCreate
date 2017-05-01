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
            "&grant_type=fb_exchange_token&fb_exchange_token=" + req.query.access_token
        };
        
        var userID = req.query.id;
        var request = require('request');
        var url = 'https://graph.facebook.com/' + options.path;
        
        console.log(url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Receive from FB",body); 
                body = JSON.parse(body);
                // var url2="http://token-manager:3000/token?id="+ userID +'&access_token=' + body.access_token +'&expires=' + body.expires_in;
                // console.log(url2);
                // request(url2, function (error, response, body) {
                //     if (!error && response.statusCode == 200) {
                //         console.log("Receive from Token Manager",body); 
                //     }
                //     else if (error){console.log(error);}
                // });
                
                request.post(
                    'http://token-manager:3000/token',
                    { json: { id: userID, access_token:body.access_token, expires:body.expires_in} },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body)
                        }
                    }
                );
                
                
                return res.send(body);
            }
            else if (error){console.log(error);}
        });
    });
}
 
module.exports = appRouter;
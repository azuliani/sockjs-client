var request = require("request");
var Socks = require("socks");

module.exports = function fetchUrl(url, headers, socksConf, callback) {
    function doTry(retries) {
        if (retries == 0) throw "Ran out of retries on " + url;
        var socksAgent = new Socks.Agent(socksConf,
            true, // we are connecting to a HTTPS server, false for HTTP server
            false // rejectUnauthorized option passed to tls.connect(). Only when secure is set to true
        );
        var options = {
            url: url,
            headers: headers,
            agent: socksAgent
        };
        request(options, function (error, response, body) {
            console.log(url);
            if (error) console.log(error);
            if (error) return doTry(retries - 1);

            callback(null, body);
        });
    }

    doTry(10);
}
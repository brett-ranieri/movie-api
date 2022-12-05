const http = require('http'), //can group require's together in one const (, then end w/ ;)
fs = require('fs'),
url = require('url');


/////////////START - Request Handler IIFE///////////////////////////
http.createServer((request, response) => {
    let addr = request.url, //can establish multiple variables in one let (, then end w/ ;)
    q = url.parse(addr, true),
    filePath = ''; //empty variable to be filled later

    //logs request in log.txt file
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
    
    //checks for documentation in URL, updates filePath
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }
    //grabs appropriate document from server, and responds with it (or error)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });

}).listen(8080);
/////////////////////END - Request Handler IIFE//////////////////////////////////
console.log('My first Node test server is running on Port 8080.');
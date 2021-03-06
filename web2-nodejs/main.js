var http = require('http');
var fs = require('fs');
var url = require('url');
var qs  = require('querystring');
var template = require('./lib/template.js');
var path = require('path');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname
    if(pathname === '/') {
        if(queryData.id === undefined) {
            fs.readdir('./data', (err, fl) => {
                var title = 'welcome';
                var description = 'Hello, Node.js';
                var list = template.list(fl);
                var html = template.html(title, list, 
                    `<h2>${title}</h2>`,
                    `<p>${description}</p>`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('./data', (err, fl) => {
                var filteredId = path.parse(qureryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                    var title = queryData.id;
                    var list = template.list(fl);
                    var html = template.html(title, list, 
                        `<h2>${title}</h2><p>${description}</p>`, 
                        `<a href="/create">create</a>
                         <a href="/update?id=${title}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname ==='/create') {
        fs.readdir('./data', (err, fl) => {
            var title = 'WEB - create';
            var list = template.list(fl);
            var html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <p><input type='text' name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `,'');
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname ==='/create_process') {
        var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if (pathname ==='/update') {
        fs.readdir('./data', (err, fl) => {
            var filteredId = path.parse(qureryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                var title = queryData.id;
                var list = template.list(fl);
                var html = template.html(title, list, `
                <form action="/update_process" method="post">
                    <input type='hidden' name="id" value = ${title}>
                    <p><input type='text' name="title" placeholder="title" value = ${title}></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `, `<a href="/create">create</a>
                <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname ==='/update_process') {
        var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if (pathname ==='/delete_process') {
        var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, (err) => {
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }

    
});
app.listen(3000);
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs','utf8');　//テンプレートファイルの読み込み(同期処理)
const style_css = fs.readFileSync('./style.css','utf8');
const other_page = fs.readFileSync('./other.ejs','utf8');

var server = http.createServer(getFromCliant); //レンダリングの実行

server.listen(3000);
console.log('server start!');

//ここまでメインプログラム

//createServerの処理
function getFromCliant(request,response){
    var url_parts = url.parse(request.url,true);

    switch(url_parts.pathname){

        case '/':
            response_index(request,response);
            break;
    
        case '/other':
            response_other(request,response);
            break;

        case '/style.css':
            response.writeHead(200,{'Content-Type':'text/css'});
            response.write(style_css);
            response.end();
            break;

        default:
            response.writeHead(200,{'Content-Type':'text/plain'});
            response.end('no page...');
            break;
        }
    }

//追加するデータ用変数
var data = {msg:'no massaeg...'};
//indexのアクセス処理
function response_index(request,response){

    if(request.method =='POST'){
        var body = '';

    request.on('data',(data) => {
        body +=data;
    });

    request.on('end',() =>{
        data = qs.parse(body);
        write_index(request,response);
    });

    } else {
        write_index(request,response);
        }
    }
    
    function write_index(request,response){
        var msg = "※伝言板を表示します"
        var content = ejs.render(index_page,{
            title:"index",
            content:msg,
            data:data,
        });
        response.writeHead(200,{'Content-Type':"text/html"});
        response.write(content);
        response.end();
    }


    function response_other(request,response){
        var msg = "これはOtherページです。"
        var content = ejs.render(other_page,{
            title:'Other',
            content:msg,
            data:data2,
            filename:'data_item'
        });
        response.writeHead(200,{'Content-Type':'text/html'});
        response.write(content);
        response.end();
    }
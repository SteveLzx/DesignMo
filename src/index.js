const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // console.log(req);
  // 请求行:请求方式,路径,HTTP版本;
  let { method, httpVersion, headers } = req;
  console.log('请求方式:', method);
  console.log('HTTP版本:', httpVersion);
  let { pathname, query } = url.parse(req.url);
  console.log('路径:', pathname);
  console.log('请求参数:', query);
  console.log('请求头:', headers);
  
  req.on('data', (data) => {
    console.log(data.toString());
  })

  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'text/html;charset=utf8');

  res.end('哈哈');
});

server.listen(3000, () => {
  console.log('server running at port 3000');
});
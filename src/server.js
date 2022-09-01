// 强制缓存于协商缓存

const http = require('http');
const url = require('url');
const path = require('path');
const { stat, readFile } = require('fs/promises');
const crypto = require('crypto');

http.createServer( async (req, res) => {
  const { pathname } = url.parse(req.url);
  console.log('pathname', pathname);
  const fileName = pathname === '/'
    ? path.join(__dirname, '../', 'static/index.html')
    : path.join(__dirname, '../', pathname);

  // 设置缓存
  // 强制缓存
  // res.setHeader('Expires', new Date(new Date().getTime() + 1000 * 10)).toGMTString();
  res.setHeader('Cache-Control', 'max-age=10');

  try {
    const statObj = await stat(fileName);
    // 协商缓存
    const ctime = statObj.ctime.toGMTString();
    res.setHeader('Last-Modified', ctime);
    if (req.headers['if-modified-since'] === ctime) {
      return (res.statusCode = 304) && res.end();
    }
  
    if (statObj.isFile()) {
      const result = await readFile(fileName);

      const hash = crypto.createHash('md5').update(result).digest('base64');

      // 协商缓存
      res.setHeader('Etag', hash);
      if (req.headers['if-none-match'] === hash) {
        return (res.statusCode = 304) && res.end();
      };

      res.end(result);
    } else {
      res.statusCode = 404;
      res.end('404');      
    }
  } catch (error) {
    console.log('error', error)
    res.statusCode = 404;
    res.end('404');
  }
  // console.log('fileName', fileName);
}).listen(3000, () => {
  console.log('server 3000');
});
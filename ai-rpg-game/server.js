// ═══════════════════════════════════════════
// 命运织机 — 本地代理服务器（解决 CORS 问题）
// 使用方法：
//   node server.js
// 然后浏览器打开: http://localhost:8787
// 游戏内设置 API: http://localhost:8787/v1
// ═══════════════════════════════════════════

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { URL } = require('url');

const PORT = 8787;
const API_TARGET = process.env.API_TARGET || 'https://token.sensenova.cn';

// MIME 类型
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.md':   'text/plain; charset=utf-8',
};

/* 代理请求到 AI API（支持 HTTP 和 HTTPS） */
function proxyToAPI(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const bodyParts = [];

  req.on('data', chunk => bodyParts.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(bodyParts);

    const targetUrl = new URL(API_TARGET);
    const pathStr = url.pathname + (url.search || '');
    const isHttps  = targetUrl.protocol === 'https:';

    // 获取原始 Authorization header
    const authHeader = req.headers['authorization'] || '';

    // 调试日志
    const dateStr = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    console.log(`[${dateStr}] ${req.method} ${pathStr} → ${targetUrl.host}${pathStr} ${authHeader ? '(有Key)' : '(无Key)'}`);

    const options = {
      hostname: targetUrl.hostname,
      port:     targetUrl.port || (isHttps ? 443 : 80),
      path:     pathStr,
      method:   req.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      rejectUnauthorized: false, // 允许自签名证书
    };

    // 用正确的协议模块
    const transport = isHttps ? https : http;
    const proxyReq = transport.request(options, (proxyRes) => {
      let responseBody = '';

      proxyRes.on('data', chunk => responseBody += chunk);

      proxyRes.on('end', () => {
        console.log(`[${dateStr}] ← ${proxyRes.statusCode} (${responseBody.length} bytes)`);

        // 添加 CORS 头
        res.writeHead(proxyRes.statusCode, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json',
        });
        res.end(responseBody);
      });
    });

    proxyReq.on('error', (e) => {
      console.error(`[ERROR] ${e.message}`);
      // 如果 Key 为空，给出更友好的提示
      const isAuthError = e.message.includes('401') || e.message.includes('auth');
      const errorMsg = authHeader
        ? (isAuthError ? 'API Key 无效或权限不足' : `代理连接失败: ${e.message}`)
        : '未填写 API Key，请在设置中配置';

      res.writeHead(502, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      res.end(JSON.stringify({ error: { message: errorMsg } }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}

/* 处理 OPTIONS 预检请求 */
function handleOptions(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  });
  res.end();
}

/* 主请求处理 */
const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, 'http://localhost').pathname;

  // OPTIONS 预检
  if (req.method === 'OPTIONS') {
    return handleOptions(res);
  }

  // API 代理路由
  if (urlPath.startsWith('/v1/') || urlPath === '/v1') {
    return proxyToAPI(req, res);
  }

  // 静态文件服务
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('╔══════════════════════════════════════╗');
  console.log('║   🦞 命运织机 — 代理服务器已启动      ║');
  console.log('║                                      ║');
  console.log(`║   浏览器打开: http://localhost:${PORT} ║`);
  console.log('║                                      ║');
  console.log('║   游戏设置:                          ║');
  console.log(`║     API 地址: http://localhost:${PORT}/v1`);
  console.log('║     Key:   sk-zK49TQEOyXQVtgaOzJ19KeI1wwx5AVoS');
  console.log('║     模型:  sensenova-6.7-flash-lite  ║');
  console.log('║     max_tokens: 4096 (建议)          ║');
  console.log('║                                      ║');
  console.log('║   按 Ctrl+C 停止服务器               ║');
  console.log('╚══════════════════════════════════════╝');
});
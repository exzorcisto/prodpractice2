const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DUMMY_JSON_API = 'https://dummyjson.com/products';
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);

const server = http.createServer(async (req, res) => {
  let parsedUrl = url.parse(req.url, true);
  let requestPath = parsedUrl.pathname;
  let method = req.method.toUpperCase();
  let query = parsedUrl.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET' && !requestPath.startsWith('/api')) {
    let filePath = requestPath === '/' ? 'index.html' : requestPath.substring(1);
    filePath = path.join(PUBLIC_DIR, filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return respond(res, 404, { error: 'Файл не найден' });

      fs.readFile(filePath, (err, data) => {
        if (err) return respond(res, 500, { error: 'Ошибка сервера' });
        let ext = path.extname(filePath);
        let contentType = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.webp': 'image/webp'
        }[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.writeHead(200);
        res.end(data);
      });
    });
    return;
  }

  try {
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (requestPath === '/api/products' && method === 'GET') {
      let apiUrl = buildApiUrl(DUMMY_JSON_API, query);
      let data = await makeRequest(apiUrl);
      await downloadAndSaveImages(data.products);
      respond(res, 200, data);
    }

    else if (/^\/api\/products\/\d+$/.test(requestPath) && method === 'GET') {
      let productId = requestPath.split('/')[3];
      let data = await makeRequest(`${DUMMY_JSON_API}/${productId}`);
      await downloadAndSaveImages([data]);
      respond(res, 200, data);
    }

    else if (requestPath === '/api/products/search' && method === 'GET') {
      let { q } = query;
      if (!q) return respond(res, 400, { error: 'Search query parameter "q" is required' });
      let apiUrl = `${DUMMY_JSON_API}/search?q=${encodeURIComponent(q)}`;
      let data = await makeRequest(apiUrl);
      await downloadAndSaveImages(data.products);
      respond(res, 200, data);
    }

    else {
      respond(res, 404, { error: 'Эндпоинты не найдены' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('404')) {
      respond(res, 404, { error: 'Продукты не найдены' });
    } else {
      respond(res, 500, { error: 'Ошибка сервера' });
    }
  }
});

async function downloadAndSaveImages(products) {
  for (let product of products) {
    let filename = path.join(IMAGES_DIR, `product_${product.id}.jpg`);
    if (fs.existsSync(filename)) continue;

    let imageUrl = product.thumbnail;
    let file = fs.createWriteStream(filename);

    await new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
          console.log(`Сохранение изображения: ${filename}`);
        });
      }).on('error', reject);
    });
  }
}

function buildApiUrl(base, query) {
  let params = new URLSearchParams();
  ['limit', 'skip', 'select'].forEach(key => {
    if (query[key]) params.append(key, query[key]);
  });
  return params.toString() ? `${base}?${params.toString()}` : base;
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function respond(res, statusCode, data) {
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
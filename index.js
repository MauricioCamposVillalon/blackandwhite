
const yargs = require('yargs');
const Jimp = require('jimp');
const http = require("http");
const fs = require("fs");
const url = require('url');


const argv = yargs.command('clave', 'verica si la clave es correcta para continuar el programa',
  {
    passw: {
      describe: 'Argumento que define una clave para continuar',
      alias: 'cl',
    },
  },
  (args) => {
    args.passw != 123 ? console.log('No puedes acceder al contenido clave erronea')
      : http
        .createServer((req, res) => {
          // Paso 1
          if (req.url == "/") {
            res.writeHead(200, { "Content-Type": "text/html" });
            fs.readFile("index.html", "utf8", (err, html) => {
              res.end(html);
            });
          }
          // Paso 2
          if (req.url == "/estilos") {
            res.writeHead(200, { "Content-Type": "text/css" });
            fs.readFile("style.css", (err, css) => {
              res.end(css);
            });
          }
          // Paso 3
          let requestUrl = url.parse(req.url, true).query;
          const linkIm = requestUrl.imglink;
          if (req.url.includes('/imagen')) {
             Jimp.read(linkIm, (err, imagen) => {
                if (err) throw err;
                imagen.resize(350, Jimp.AUTO)
                  .greyscale()
                  .quality(60)
                  .writeAsync("newImg.jpg")
                  .then(() => {
                    fs.readFile("newImg.jpg", (err, img) => {
                      res.writeHead(200, { 'content-type': 'image/jpeg' })
                      res.end(img);
                    });
                  });
              }).catch(err => {
                console.error(err);
                res.writeHead(500, { 'content-type': 'text/html' })
                res.write("<p>ha ocurrido un eror al procesar la imagen</p>");
                res.end();
              });
          }
        })
  .listen(3000, () => console.log("Servidor encendido en http://localhost:3000"));

  }).help().argv;


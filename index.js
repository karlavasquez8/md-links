const fs = require('fs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt()//constructor del md

const jsdom = require('jsdom');
const { JSDOM } = jsdom;//constructor de jsdom

const nodePath = require('node:path')

const axios = require('axios');


//funciones
//funcion para saber si es un archivo
function isFile(path) {
  return fs.statSync(path).isFile()
}

//funcion para abrir un archivo
function openFile(path) {
  return fs.readFileSync(path, 'utf8')
}
//funcion para saber si es un directorio'
function isDirectory(path) {
  return fs.statSync(path).isDirectory()
}

//funcion para abrir un directorio
function openDir(path) {
  return fs.readdirSync(path)
}

//convirtiendo a ruta absoluta
function pathAbsolute(route) {
  return path.isAbsolute(route) ? route : path.resolve(route)
}

//funcion para verificar si existe una ruta
function pathExist(path) {
  return fs.existsSync(path)
}

function scanLinks(path) {
  const contentFile = openFile(path)
  //convirtiendo a string de html el archivo md
  const stringHtml = md.render(contentFile)
  //con el jsdom se convierte a html 
  const htmlDom = new JSDOM(stringHtml)
  const nodeList = htmlDom.window.document.querySelectorAll('a')

  const listLink = [];

  nodeList.forEach((link) => {
    listLink.push({ href: link.href, text: link.innerHTML, file: path })
  })
  return listLink
};

//HTTP
//Funcion para validar los links que se extrajeron
const validateServer = (path) => {
  return axios(path)
    .then((data) => {
      if (data.status === 200) {
        return {
          path,
          status: data.status,
          menssage: 'ok'
        };
      }
    })
    .catch((error) => {
      return ({
        path,
        status: error.response.status,
        menssage: 'fail'
      })
    })
};

validateServer('https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/').then((data) => {
  console.log(data)
})

//new Promise((resolve, reject) => {
//   axios.get(paths)
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// })



const mdLinks = (path, config = { validate: false }) => {
  if (isFile(path)) {
    scanLinks(path)
  }
  if (isDirectory(path)) {
    const files = openDir(path)
    let listLinks = []

    files.forEach((file) => {
      //ruta completa del directorio
      // const fullPath = nodePath.join(path, file)
      const fullPath = nodePath.resolve(nodePath.join(path, file))
      listLinks = [...listLinks, ...scanLinks(fullPath)]
    })
  }



  // arraylist =openDir(path)
  // arraylist.forEach()
};

module.exports = {
  isFile,
  openFile,
  openDir,
  isDirectory,
  scanLinks,
}

mdLinks('storage/file.md', { validate: true });
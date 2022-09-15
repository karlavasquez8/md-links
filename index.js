const fs = require('fs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt()//constructor del md

const jsdom = require('jsdom');
const { JSDOM } = jsdom;//constructor de jsdom

const nodePath = require('node:path')

const axios = require('axios');
const { url } = require('inspector');
const { errorMonitor } = require('events');


//funcion para verificar la extension de un archivo
function fileExtension(path) {
  return nodePath.extname(path) === '.md'
}
// console.log(fileExtension('storage/prueba.md'))

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

// funcion que verifica si la path es absoluta
function isPathAbsolute(route) {
  return nodePath.isAbsolute(route)
}
//convirtiendo a ruta absoluta
function toPathAbsolute(route) {
  return isPathAbsolute(route) ? route : nodePath.resolve(route)
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
const validateLink = (url) => {
  return axios(url)
    .then((data) => {
      if (data.status === 200) {
        return {
          url,
          status: data.status,
          menssage: 'ok'
        };
      }
    })

  // .catch((error) => {
  //   console.log({ error })
  //   return ({
  //     url,
  //     // status: error.response.status,
  //     menssage: 'fail'
  //   })
  // })
};


// probando el la funcion para validar links
// validateLink('https://www.geeksforgeeks.org/node-js-fs-readfilesync-method2/').then((data) => {
//   console.log(data)
// })
//   .catch((error) => {
//     console.log(error.response.status)
//   })

const mdLinks = (path, config = { validate: false }) => {
  return new Promise((resolve, reject) => {
    if (!pathExist(path)) {
      // console.log('no existe la ruta')
      reject(new Error('no existe la ruta'))
    }
    // const isFile = isFile(path)
    const pathAbsolute = toPathAbsolute(path)
    // console.log(pathAbsolute)
    const listFoundLinks = scanLinks(pathAbsolute)
    // console.log(listFoundLinks)
    const promisesArray = listFoundLinks.map(async (items) => {
      try {
        const resultItem = await validateLink(items.href)
        return { ...items, ...resultItem }
      } catch (error) {
        return {
          ...items,
          url: items.href,
          status: error.response.status,
          message: error.response.statusText
        }
      }
    })

    const result = Promise.all(promisesArray)
    result.then((resultado) => {
      console.log(resultado)
    })
    resolve(result);
  })


  // if (isDirectory(path)) {
  //   const files = openDir(path)
  //   let listLinks = []

  //   files.forEach((file) => {
  //     //ruta completa del directorio
  //     // const fullPath = nodePath.join(path, file)
  //     const fullPath = nodePath.resolve(nodePath.join(path, file))
  //     listLinks = [...listLinks, ...scanLinks(fullPath)]
  //   })

  // }
}
//   if (isFile(path)) {
//     scanLinks(path)
//   }
// if (isDirectory(path)) {
//   const files = openDir(path)
//   let listLinks = []

//   files.forEach((file) => {
//     //ruta completa del directorio
//     // const fullPath = nodePath.join(path, file)
//     const fullPath = nodePath.resolve(nodePath.join(path, file))
//     listLinks = [...listLinks, ...scanLinks(fullPath)]
//   })
// }



// arraylist =openDir(path)
// arraylist.forEach()


module.exports = {
  isFile,
  openFile,
  openDir,
  isDirectory,
  scanLinks,
}

mdLinks('storage/prueba.md', { validate: true });
const fs = require('fs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt()//constructor del md

const jsdom = require('jsdom');
const { JSDOM } = jsdom;//constructor de jsdom

const nodePath = require('node:path')

const axios = require('axios');


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
function validateLink(url) {
  return axios.get(url)
    .then((data) => {
      if (data.status === 200) {
        return {
          url,
          status: data.status,
          menssage: 'ok'
        };
      }
    })
};

// probando el la funcion para validar links
// validateLink('https://www.geeksforgeeks.org/node-js-fs-readfilesync-method2/').then((data) => {
//   console.log(data)
// })
//   .catch((error) => {
//     console.log(error.response.status)
//   })

function processFile(path, config) {
  return new Promise((resolve) => {
    // const isFile = isFile(path)
    const listFoundLinks = scanLinks(path)
    // console.log(listFoundLinks)
    if (config.validate === true) {
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
      Promise.all(promisesArray).then((result) => {
        resolve(result)
      })

    } else {
      resolve(listFoundLinks)
    }
  })

}

function getPathsDirectory(path) {
  const files = openDir(path)
  const fileMd = files.filter(file => fileExtension(file))

  return fileMd.map((file) => {
    //ruta completa del directorio, carpeta con archivo de tipo string
    return nodePath.resolve(nodePath.join(path, file))
  })
}
// console.log(getPathsDirectory('storage'))

function stats(arrayLinks) {
  const totalLinks = arrayLinks.map(link => link.href);
  const uniqueLinks = [...new Set(totalLinks)]
  return {
    Total: totalLinks.length,
    Unique: uniqueLinks.length,
  }

}
function totalLink(arrayLinks) {
  const totalLinks = arrayLinks.map(link => link.href);
  const uniqueLinks = [...new Set(totalLinks)]
  const broken = arrayLinks.filter(link => link.status != 200)
  return {
    Total: totalLinks.length,
    Unique: uniqueLinks.length,
    Broken: broken.length,
  }
}
console.log(stats(scanLinks('storage/file.md')))

const mdLinks = (path, config = { validate: false }) => {
  return new Promise((resolve, reject) => {
    const pathAbsolute = toPathAbsolute(path)
    if (!pathExist(pathAbsolute)) {
      // console.log('no existe la ruta')
      reject(new Error('no existe la ruta'))
    }
    if (isFile(pathAbsolute)) {
      processFile(pathAbsolute, config).then((arrayObject) => {
        resolve(arrayObject)
      })
    }

    if (isDirectory(pathAbsolute)) {
      const arrayPath = getPathsDirectory(pathAbsolute)
      const totalResult = arrayPath.map((route) => {
        return mdLinks(route, config);
      })

      Promise.all(totalResult).then((total) => {
        resolve(total.flat())
      })
    }

  })

}


module.exports = {
  isFile,
  openFile,
  openDir,
  isDirectory,
  scanLinks,
  validateLink,
  getPathsDirectory,
  processFile,
}

// mdLinks('storage', { validate: true }).then((resultados) => {
//   console.log(resultados)
// })
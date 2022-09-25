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
      // console.log(data)
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
// validateLink('/Users/karlita/proyectos/LIM018-md-links/storage/prueba2.md').then((data) => {
//   console.log(data)
// })
//   .catch((error) => {
//     console.log(error.response)
//   })

function stats(arrayLinks, config) {
  const totalLinks = arrayLinks.map(link => link.href);
  const uniqueLinks = [...new Set(totalLinks)]
  const broken = arrayLinks.filter(link => link.status != 200)
  if (config.validate === true) {
    return {
      Total: totalLinks.length,
      Unique: uniqueLinks.length,
      Broken: broken.length,
    }
  }
  return {
    Total: totalLinks.length,
    Unique: uniqueLinks.length,
  }
}

function processFile(path, config) {
  return new Promise((resolve) => {
    // const isFile = isFile(path)
    const listFoundLinks = scanLinks(path)
    // console.log(listFoundLinks)
    if (config.validate === true) {
      const promisesArray = listFoundLinks.map(async (items) => {
        try {
          const resultItem = await validateLink(items.href)
          // console.log(resultItem)
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

// processFile(`/Users/karlita/proyectos/LIM018-md-links/storage/file2.md`, { validate: true }).then((resultar) => {
//   // console.log(resultar)
// })
//   .catch((error) => {
//     console.log(error)
//   })


// validateLink('https://www.geeksforgeeks.org/node-js-fs-readfilesync-method2/').then((data) => {
//   // console.log(data)
// })
//   .catch((error) => {
//     console.log(error)
//   })



function getPathsDirectory(path) {
  const files = openDir(path)
  const fileMd = files.filter(file => fileExtension(file))

  return fileMd.map((file) => {
    //ruta completa del directorio, carpeta con archivo de tipo string
    return nodePath.resolve(nodePath.join(path, file))
  })
}
// console.log(getPathsDirectory('storage'))

const mdLinks = (path, config = { validate: false, stats: false }) => {
  return new Promise((resolve, reject) => {
    const pathAbsolute = toPathAbsolute(path)
    if (!pathExist(pathAbsolute)) {
      // console.log('no existe la ruta')
      reject(new Error('no existe la ruta'))
    }
    if (isFile(pathAbsolute)) {
      processFile(pathAbsolute, config).then((arrayObject) => {
        if (config.stats === true) {
          resolve(stats(arrayObject, { validate: config.validate }))
        }
        resolve(arrayObject)
      })

    }

    if (isDirectory(pathAbsolute)) {
      const arrayPath = getPathsDirectory(pathAbsolute)
      const totalResult = arrayPath.map((route) => {
        //console.log(route)
        return mdLinks(route, config);
      })

      Promise.all(totalResult).then((total) => {
        if (config.stats === true) {
          //totalResult es un array de objeto
          const initStat = config.validate === true ? { Total: 0, Unique: 0, Broken: 0 } : { Total: 0, Unique: 0 };

          const statResult = total.reduce((prev, curr) => {
            const total = prev.Total + curr.Total
            const unique = prev.Unique + curr.Unique
            const broken = prev.Broken + curr.Broken
            return config.validate === true ? { Total: total, Unique: unique, Broken: broken } : { Total: total, Unique: unique, }
          }, initStat)

          resolve(statResult)
        }

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
  toPathAbsolute,
  fileExtension,
  pathExist,
  stats, mdLinks
}

// mdLinks('storage', { validate: true, stats: true }).then((resultados) => {
//   console.log(resultados)
// })

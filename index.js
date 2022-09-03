const fs = require('fs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt()

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const nodePath = require('node:path')

function isFile(path) {
  return fs.statSync(path).isFile()
}

function openFile(path) {
  return fs.readFileSync(path, 'utf8')
}
//me devuelve el contenido'
function isDirectory(path) {
  return fs.statSync(path).isDirectory()
}

function openDir(path) {
  return fs.readdirSync(path)
}

function scanlinks(path) {
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
}


const mdLinks = (path, config = { validate: false }) => {
  if (isFile(path)) {
    console.log(scanlinks(path))
  }
  if (isDirectory(path)) {
    const files = openDir(path)
    console.log(files)
    let listLinks = []

    files.forEach((file) => {
      //ruta completa del directorio
      const fullPath = nodePath.join(path, file)
      listLinks = [...listLinks, ...scanlinks(fullPath)]
    })
    console.log(listLinks)
  }



  // arraylist =openDir(path)
  // arraylist.forEach()
};

module.exports = mdLinks;

mdLinks('storage', { validate: true });
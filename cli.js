#!/usr/bin/env node
const { mdLinks } = require('./index.js');
const chalk = require('chalk');
// console.log(chalk.blue('hello world!'))

const pathOrHelp = process.argv[2]
const config = process.argv.slice(2);

//argv[0] es la ruta del nodo 
//argv[1] es la ruta del codigo de secuencia de comandos, md-links
const isValidate = config.includes('--validate')
// console.log(hasValidate)
const isStats = config.includes('--stats')
const help = config.includes('--help')

if (pathOrHelp === undefined) {
    console.log(chalk.red(`
    █▀▀▀
    █   █▀▀█ ▀▀█▀▀  █        █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
    █▀▀ █  █   █    █        █       Please enter a path of the file or         █
    █   █▀▀█   █    █        █  directory you want to scan or else enter --help █
    ▀   ▀  ▀ ▀▀▀▀▀  ▀▀▀      ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    `))
} else {
    if (help) {
        console.log(chalk.yellowBright(`

        █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█ Do you need help?
        █  ╦ ╦╔╗╦ ╔╗╔╗╔╦╗╔╗  █ This are the commands options:
        █  ║║║╠ ║ ║ ║║║║║╠   █ --validate (to get href,title, status and message for each link)
        █  ╚╩╝╚╝╚╝╚╝╚╝╩ ╩╚╝  █ --stats (to get total links and unique links)
        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ --validate --stats (to get Total, Unique and Broken links) 
        `))
    } else {
        mdLinks(pathOrHelp, { validate: isValidate, stats: isStats })
            .then((result) => {
                console.log(result)

            }).catch((error) => {
                if (error.message === 'no existe la ruta') {
                    console.log(chalk.red(`
                     ▄    ▄▄▄▄▄▄▄    ▄
                    ▀▀▄ ▄█████████▄ ▄▀▀    █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
                        ██─▀███▀─██        █  Something bad happened,   █
                      ▄ ▀████▀████▀ ▄      █  this route does not exist █
                    ▀█    ██▀█▀██    █▀    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                  `))
                }

            })
    }
}




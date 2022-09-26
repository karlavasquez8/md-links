
![logo-mdLinks](https://github.com/karlavasquez8/md-links/blob/main/img-readme/logo-mdLinks.png?raw=true)

[MD-LINKS] Es una libreria de NodeJS que permite analizar los archivos de tipo 
`Markdown`, ya sea desde un archivo o directorio, que pueden estar alojados dentro
 de carpetas .

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

## Diagrama de Flujo

![Diagrama de flujo](/Users/karlita/proyectos/LIM018-md-links/img-readme/diagrama-de-flujo.png)

## Instalar

npm install md-links-kvasquez

## Version
0.1.0

## Comando CLI
#### Guia 
Si el usuario no ingresa ninguna url se mostrará el mensaje indicando el error.

![message fail](https://github.com/karlavasquez8/md-links/blob/main/img-readme/fail.png?raw=true)

Si se solicita ayuda se puede ingresar la opcion `--help`, el cual le detallará las opciones.

![message help](https://github.com/karlavasquez8/md-links/blob/main/img-readme/help.png?raw=true)

Si se ingresa una ruta que no existe se mostrará el siguiente mensaje
![message not exist](https://github.com/karlavasquez8/md-links/blob/main/img-readme/route-no-exist.png?raw=true)


#### Options

##### `--validate`

Si pasamos la opción `--validate`, el módulo debe hacer una petición HTTP para
averiguar si el link funciona o no. Si el link resulta en una redirección a una
URL que responde ok, entonces consideraremos el link como ok.

![validate true](https://github.com/karlavasquez8/md-links/blob/main/img-readme/validate-true.png?raw=true)

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

![stats default](https://github.com/karlavasquez8/md-links/blob/main/img-readme/stats-false.png?raw=true)

##### `--validate stats`

También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación.

![stats true](https://github.com/karlavasquez8/md-links/blob/main/img-readme/stats-true.png?raw=true)


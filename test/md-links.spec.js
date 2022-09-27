const {
  isFile,
  isDirectory,
  openFile,
  openDir,
  scanLinks,
  validateLink,
  processFile,
  getPathsDirectory,
  toPathAbsolute,
  fileExtension,
  pathExist,
  stats,
  mdLinks

} = require('../index.js');
const axios = require('axios')
jest.mock('axios')



describe('is File', () => {
  it('should be a file ./storage/file.md', () => {
    expect(isFile('./storage/file.md')).toBeTruthy()
  });
  it('not should be a directory ./storage/file.md', () => {
    expect(isFile('./storage')).toBeFalsy();
  });
});

describe('is Directory', () => {
  it('should be a directory ./storage', () => {
    expect(isDirectory('./storage')).toBeTruthy()
  });
  it('not should be a file ./storage', () => {
    expect(isDirectory('./storage/prueba.md')).toBeFalsy();
  });
});

describe('Directory Content', () => {
  it('should read directory content', () => {
    const result = [
      'file.md',
      'prueba.md',
      'prueba.txt',
      'pruebadecontenido.md',
    ];
    expect(openDir('./storage')).toEqual(result)
  });
});

describe('file content', () => {
  it('should read file content', () => {
    expect(openFile('./storage/pruebadecontenido.md')).toEqual('Estos archivos Markdown normalmente contienen links, vínculos y ligas.')
  })
})

describe('scanLinks', () => {
  const arrayLinks = [
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: 'storage/prueba.md'
    },
    {
      href: 'https://nodejs.org/',
      text: 'Node.js',
      file: 'storage/prueba.md'
    }
  ];
  it('should return an array of links', () => {
    expect(scanLinks('storage/prueba.md')).toEqual(arrayLinks)
  })
})
describe('path is absolute', () => {
  it('should return an absolute path', () => {
    const path = 'https://github.com/karlavasquez8/md-links/blob/main/storage/prueba.md'
    expect(toPathAbsolute(path)).toBeTruthy()
  })
})

describe('extension md', () => {
  it('should return a path with extension md', () => {
    expect(fileExtension('storage/prueba.md')).toBeTruthy()
    expect(fileExtension('storage/prueba.txt')).toBeFalsy()
  })
})

describe('existing path', () => {
  it('should return an existing path', () => {
    expect(pathExist('storage/prueba.md')).toBeTruthy()
    expect(pathExist('storage/prueba2.md')).toBeFalsy()
  })
})

describe('statistics', () => {
  it('should return the statistics of the path --validate true', () => {
    const arrayObject = [
      {
        href: 'https://nodejs.org/es/',
        text: 'Node.js',
        file: 'storage/file.md'
      },
    ]
    const result = { Total: 1, Unique: 1, Broken: 1 }
    expect(stats(arrayObject, { validate: true, stats: true })).toStrictEqual(result)

  })
  it('should return the statistics of the path -validate false', () => {
    const arrayObject = [
      {
        href: 'https://nodejs.org/es/',
        text: 'Node.js',
        file: 'storage/file.md'
      },
    ]
    const result = { Total: 1, Unique: 1 }
    expect(stats(arrayObject, { validate: false, stas: true })).toStrictEqual(result)
  })
})

describe('validate Links', () => {

  it('should return an object with a status of ok', () => {
    expect.assertions(1)
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    validateLink('https://nodejs.org/').then((data) => {
      expect(data).toEqual({ url: 'https://nodejs.org/', status: 200, menssage: 'ok' })
    })
  })

  it('should return an object with a status of fail', () => {
    expect.assertions(1)
    axios.get.mockImplementationOnce(() => Promise.reject({ response: { status: 404 } }))


    validateLink('https://www.geeksforgeeks.org/node-js-fs-readfilesync-method2/', { validate: true }).catch((error) => {
      expect(error).toEqual({ response: { status: 404 } })
    })
  })
})

describe('get path or directory', () => {

  it('should return an array of directory paths', () => {
    const arrayPath = [
      '/Users/karlita/proyectos/LIM018-md-links/storage/file.md',
      '/Users/karlita/proyectos/LIM018-md-links/storage/prueba.md',
      '/Users/karlita/proyectos/LIM018-md-links/storage/pruebadecontenido.md'
    ]
    expect(getPathsDirectory('storage')).toEqual(arrayPath)
  })
})

describe('process file', () => {

  it('should return an array of objects with 6 items if true', () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }))

    const trueValidate = [
      {
        href: 'https://nodejs.org/es/',
        text: 'Node.js',
        file: '/Users/karlita/proyectos/LIM018-md-links/storage/file.md',
        url: 'https://nodejs.org/es/',
        status: 200,
        menssage: 'ok'
      },
      {
        href: 'https://developers.google.com/v8/',
        text: 'motor de JavaScript V8 de Chrome',
        file: '/Users/karlita/proyectos/LIM018-md-links/storage/file.md',
        url: 'https://developers.google.com/v8/',
        status: 200,
        menssage: 'ok'
      }
    ]
    processFile(`/Users/karlita/proyectos/LIM018-md-links/storage/file.md`, { validate: true }).then((result) => {
      expect(result).toEqual(trueValidate)
    })
  })

  it('should return an array of objects with 3 items if false', () => {
    expect.assertions(1);

    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }))
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200 }))

    const validateFalse = [
      {
        href: 'https://nodejs.org/es/',
        text: 'Node.js',
        file: '/Users/karlita/proyectos/LIM018-md-links/storage/file.md',
      },
      {
        href: 'https://developers.google.com/v8/',
        text: 'motor de JavaScript V8 de Chrome',
        file: '/Users/karlita/proyectos/LIM018-md-links/storage/file.md',
      }
    ]
    processFile(`/Users/karlita/proyectos/LIM018-md-links/storage/file.md`, { validate: false }).then((result) => {
      expect(result).toEqual(validateFalse)
    })
  })
})

describe('md links', () => {
  const config = {
    validate: false,
    stats: false,
  }
  const arrayLinks = [
    {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/karlita/proyectos/LIM018-md-links/storage/prueba.md'
    },
    {
      href: 'https://nodejs.org/',
      text: 'Node.js',
      file: '/Users/karlita/proyectos/LIM018-md-links/storage/prueba.md'
    }
  ]

  it('should return an error if the path does not exist', () => {
    mdLinks('/storage/file2.md', config).catch((error) => {
      expect(error.message).toBe('no existe la ruta')
    })
  })

  it('should return an array of objects with links if the path exists', () => {
    mdLinks('/Users/karlita/proyectos/LIM018-md-links/storage/prueba.md').then((data) => {
      expect(data).toStrictEqual(arrayLinks)
    })
  })

  it('it should return the statistics if it is stats', () => {
    const statsResult = { Total: 2, Unique: 2, };
    mdLinks('/Users/karlita/proyectos/LIM018-md-links/storage/prueba.md', { stats: true }).then((data) => {
      expect(data).toStrictEqual(statsResult)
    })
  })
})

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
  stats

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

describe('validate Links', () => {
  it('should return an object with a status of ok', () => {
    axios.get.mockImplementation(() => Promise.resolve({ status: 200 }))
    validateLink('https://nodejs.org/').then((data) => {
      console.log(data)
      expect(data).toEqual({ url: 'https://nodejs.org/', status: 200, menssage: 'ok' })
    })
  })
})
describe('statistics', () => {
  it('should return the statistics of the path -validate true', () => {
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

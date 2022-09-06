const {
  isFile,
  isDirectory,
  openFile,
  openDir,
  scanLinks,

} = require('../index.js');


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
      'pruebadecontenido.md'
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

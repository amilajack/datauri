# datauri-transform

Transform string or buffer to DataURI scheme. Format layer of [Datauri Module](http://npm.im/datauri).

>  The data URI scheme is a uniform resource identifier (URI) scheme that provides a way to include data in-line in web pages as if they were external resources.

from: [Wikipedia](http://en.wikipedia.org/wiki/Data_URI_scheme)

[![Build Status](https://travis-ci.org/heldr/grunt-smushit.svg?branch=master)](http://travis-ci.org/heldr/datauri) [![Coverage Status](https://coveralls.io/repos/heldr/datauri/badge.svg?branch=master&service=github)](https://coveralls.io/github/heldr/datauri?branch=master) [![Dependency Status](https://www.versioneye.com/user/projects/560b7b3f5a262f001e0007e2/badge.svg?style=flat)](https://www.versioneye.com/user/projects/560b7b3f5a262f001e0007e2) [![NPM version](http://img.shields.io/npm/dm/datauri.svg?style=flat)](https://www.npmjs.org/package/datauri)

MODULE
-------
`npm install --save datauri-transform`

### Buffer
If you already have your file as a Buffer, use this. It's much faster than passing a string.

```js
const transform = require('datauri-transform'),

transform('.png', fs.readFileSync('./hello.png'));
//=> "data:image/png;base64,eGtjZA=="
```

### String
```js
const transform = require('datauri-transform');

transform('.png', 'xkcd');
//=> "data:image/png;base64,eGtjZA=="
```

## License

MIT License
(c) [Helder Santana](http://heldr.com)

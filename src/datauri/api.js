import path from 'path';
import {
  existsSync,
  readFileSync,
  createReadStream
} from 'fs';
import mimer from 'mimer';
import getDimensions from 'image-size';
import uri from './template/uri';
import css from './template/css';
import Stream from 'stream';

class Api extends Stream {
  constructor() {
    super();

    this.readable = true;
  }

  format(fileName, fileContent) {
    const fileBuffer = (fileContent instanceof Buffer) ? fileContent : new Buffer(fileContent);

    this.base64 = fileBuffer.toString('base64');
    this.createMetadata(fileName);

    return this;
  }

  createMetadata(fileName) {
    this.fileName = fileName;
    this.mimetype = mimer(fileName);
    const { mimetype, base64 = '' } = this;
    this.content = uri({ mimetype, base64 });

    return this;
  }

  runCallback(handler, err) {
    if (err) {
      return handler(err);
    }

    handler.call(this, null, this.content, this);
  }

  encode(fileName, handler) {
    return this.async(fileName, err => handler && this.runCallback(handler, err));
  }

  async(fileName, handler) {
    const base64Chunks = [];
    const propagateStream = chunk => this.emit('data', chunk);

    propagateStream(this.createMetadata(fileName).content);
    createReadStream(fileName, { encoding: 'base64' })
      .on('data', propagateStream)
      .on('data', chunk => base64Chunks.push(chunk))
      .on('error', err => {
        handler(err);
        this.emit('error', err);
      })
      .on('end', () => {
        this.base64 = base64Chunks.join('');
        this.emit('end');
        handler.call(this.createMetadata(fileName));
        this.emit('encoded', this.content, this);
      });
  }

  encodeSync(fileName) {
    if (!fileName || !fileName.trim || fileName.trim() === '') {
      throw new Error('Insert a File path as string argument');
    }

    if (existsSync(fileName)) {
      const fileContent = readFileSync(fileName);

      return this.format(fileName, fileContent).content;
    }

    throw new Error(`The file ${fileName} was not found!`);
  }

  getCSS(defaults = {}) {
    const config = {};

    if (!this.content) {
      throw new Error('Create a data-uri config using the method encodeSync');
    }

    config.class = defaults.class || path.basename(this.fileName, path.extname(this.fileName));
    config.background = this.content;

    if (config.width || config.height || config['background-size']) {
      config.dimensions = getDimensions(this.fileName);
    }

    return css(config);
  }
}

export default Api;

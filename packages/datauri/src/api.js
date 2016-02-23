import path from 'path';
import {
  existsSync,
  readFileSync,
  createReadStream
} from 'fs';
import getDimensions from 'image-size';
import css from './template/css';
import Stream from 'stream';
import { default as transform, format, createMetadata } from 'datauri-transform';
import assign from 'object-assign';

const noop = function() {};

class Api extends Stream {
  constructor() {
    super();

    this.readable = true;
  }

  format(...args) {
    assign(this, format(...args));

    return this;
  }

  runCallback(handler, err) {
    if (err) {
      return handler(err);
    }

    handler.call(this, null, this.content, this);
  }

  encode(fileName, handler = noop) {
    return this.async(fileName, err => handler && this.runCallback(handler, err));
  }

  async(fileName, handler = noop) {
    const base64Chunks = [];
    const propagateStream = chunk => this.emit('data', chunk);

    propagateStream(createMetadata(fileName).content);
    createReadStream(fileName, { encoding: 'base64' })
      .on('data', propagateStream)
      .on('data', chunk => base64Chunks.push(chunk))
      .on('error', err => {
        handler(err);
        this.emit('error', err);
      })
      .on('end', () => {
        const base64 = base64Chunks.join('');

        this.base64 = base64;
        this.emit('end');
        handler.call(assign(this, createMetadata(fileName, base64)));
        this.emit('encoded', this.content, this);
      });
  }

  encodeSync(fileName) {
    if (!fileName || !fileName.trim || fileName.trim() === '') {
      throw new Error('Insert a File path as string argument');
    }

    if (existsSync(fileName)) {
      let fileContent = readFileSync(fileName);

      return this.format(fileName, fileContent).content;
    }

    throw new Error(`The file ${fileName} was not found!`);
  }

  getCSS(config={}) {
    if (!this.content) {
      throw new Error('Create a data-uri config using the method encodeSync');
    }

    config.class = config.class || path.basename(this.fileName, path.extname(this.fileName));
    config.background = this.content;

    if (config.width || config.height || config['background-size']) {
      config.dimensions = getDimensions(this.fileName);
    }

    return css(config);
  }
}

export default Api;

import mimer from 'mimer';

const checkBuffer = fileContent =>
  (fileContent instanceof Buffer) ? fileContent : new Buffer(fileContent);

const transform = (mimetype, base64) => `data:${mimetype};base64,${base64}`;

export const createMetadata = (fileName, base64 = '') => {
  const mimetype = mimer(fileName);
  const content = transform(mimetype, base64);

  return { fileName, mimetype, base64, content };
};

export const format = (fileName, fileContent) => {
  return createMetadata(fileName, checkBuffer(fileContent).toString('base64'));
}

export default (...args) => format(...args).content;

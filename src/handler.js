const { request } = require('http');
const books = require('./books');

const addNoteHandler = (require, h) => {
   const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
   } = request.payload;
   
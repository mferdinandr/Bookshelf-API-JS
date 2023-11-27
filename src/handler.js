const { nanoid } = require('nanoid');
const books = require('./books');

// eslint-disable-next-line consistent-return
const addBookHandler = (request, h) => {
   const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
   } = request.payload;

   if (!name) {
      const response = h.response({
         status: 'fail',
         message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
   }

   if (readPage > pageCount) {
      const response = h.response({
         status: 'fail',
         message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
   }

   const id = nanoid(16);
   const insertedAt = new Date().toISOString();
   const updatedAt = insertedAt;
   const finished = readPage === pageCount;

   const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
   };

   books.push(newBook);
   const isSuccess = books.filter((note) => note.id === id).length > 0;

   if (isSuccess) {
      const response = h.response({
         status: 'success',
         message: 'Buku berhasil ditambahkan',
         data: {
            bookId: id,
         },
      });
      response.code(201);
      return response;
   }

   const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
   });
   response.code(500);
   return response;
};

const getAllBooksHandler = (request, h) => {
   const {
      name,
      reading,
      finished,
   } = request.query;

   let filteredBook = books;

   if (name) {
      filteredBook = books.filter((bn) => bn.name.toLowerCase().includes(name.toLowerCase()));
   }

   if (reading) {
      filteredBook = books.filter((book) => Number(book.reading) === Number(reading));
   }

   if (finished) {
      filteredBook = books.filter((book) => Number(book.finished) === Number(finished));
   }

   const response = h.response({
      status: 'success',
      data: {
         books: filteredBook.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
         })),
      },
   });
   response.code(200);
   return response;
};

const getBooksByIdHandler = (request, h) => {
   const { id } = request.params;

   const book = books.filter((n) => n.id) === id[0];

   if (book !== undefined) {
      return {
         status: 'success',
         data: {
            book,
         },
      };
   }

   const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
   });
   response.code(404);
   return response;
};

module.exports = {
   addBookHandler,
   getAllBooksHandler,
   getBooksByIdHandler,
};

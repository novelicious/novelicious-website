import React, { useState, useEffect } from "react";
import axios from "axios";

export interface Book {
  id: number;
  title: string;
  title_eng: string;
  authors: string;
  image: string;
  release_year: number;
  complete_year: number;
  synopsis: string;
  rating: number;
  n_chapters: number;
  n_volumes: number;
  status: string;
  genres: string;
  cost: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  //   const itemsPerPage = 10;

  const [booksPerPage] = useState<number>(8);
  useEffect(() => {
    let isMounted = true;

    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          setBooks(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(books.length / booksPerPage);
  const pageNumbers = [];

  const maxPageNumbersToShow = 5;
  let startPage = Math.max(
    1,
    currentPage - Math.floor(maxPageNumbersToShow / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                ID
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Title
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Authors
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Release Year
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Genres
              </th>
              <th className="py-2 px-4 bg-gray-200 border-b border-gray-300 text-sm font-semibold text-gray-600 uppercase">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.id} className="text-gray-700">
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.id}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.title}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.authors}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.release_year}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.genres}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {book.cost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <ul className="flex justify-center mt-4">
            <li className="hidden sm:block">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 border-2 ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-neutral"
                }`}
              >
                Previous
              </button>
            </li>

            {startPage > 1 && (
              <>
                <li>
                  <button
                    onClick={() => paginate(1)}
                    className="px-3 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-neutral"
                  >
                    1
                  </button>
                </li>
                <li>
                  <span className="px-3 py-2 border-2 border-transparent text-primary">
                    ...
                  </span>
                </li>
              </>
            )}

            {pageNumbers.map((number, index) => (
              <li
                key={number}
                className={`${
                  // Hide some numbers on smaller screens
                  index > 1 && index < pageNumbers.length - 2
                    ? "hidden sm:block"
                    : ""
                }`}
              >
                <button
                  onClick={() => paginate(number)}
                  className={`px-3 py-2 border-2 ${
                    currentPage === number
                      ? "bg-primary text-neutral border-primary"
                      : "border-primary text-primary hover:bg-primary hover:text-neutral"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
            {endPage < totalPages && (
              <>
                <li>
                  <span className="px-3 py-2 border-2 border-transparent text-primary">
                    ...
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-neutral"
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li className="hidden sm:block">
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border-2 ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-neutral"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookList;

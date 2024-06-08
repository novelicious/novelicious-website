import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

interface Book {
  id: number;
  cover: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
}

const Market: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filterData, setFilterData] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        const transformedBooks = res.data.map(
          (book: Omit<Book, "genres"> & { genres: string }) => ({
            ...book,
            genres: book.genres.split(",").map((genre: string) => genre.trim()),
          })
        );
        setBooks(transformedBooks);
        setFilterData(transformedBooks);
      })
      .catch((err) => {
        console.log(err);
      });

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const filteredBooks = filterData.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedGenre === "" || book.genres.includes(selectedGenre))
    );
    setBooks(filteredBooks);
  }, [searchQuery, selectedGenre, filterData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="sticky top-0 bg-white z-50">
            <Navbar />
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className=" sm:flex sm:items-center sm:justify-between">
                <div className="relative w-full ">
                  <input
                    type="text"
                    className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-blue-500 focus:outline-none focus:border-blue-500"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                  <select
                    className="w-full h-10 border-2 border-blue-500 focus:outline-none focus:border-blue-500 text-blue-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                    value={selectedGenre}
                    onChange={(e) => handleGenreChange(e.target.value)}
                  >
                    <option value="">All Genres</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Romance">Romance</option>
                    <option value="Horror">Horror</option>
                    <option value="Video Game">Video Game</option>
                    <option value="Supernatural">Supernatural</option>
                  </select>

                  {isLoggedIn && (
                    <a href="">
                      <div className="relative py-2">
                        <div className="t-0 absolute left-3">
                          <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                            0
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="file: mt-4 h-6 w-6"
                        >
                          <path
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <li key={book.id} className="border-blue-600 border-2">
                <a
                  href={`/novel/${book.id}`}
                  className="group relative block overflow-hidden"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                  />
                </a>
                <div className="relative border border-gray-100 bg-white p-6">
                  <div className="flex flex-wrap gap-1">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="text-white whitespace-nowrap bg-blue-700 px-3 py-1.5 text-xs font-medium"
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGenreChange(genre);
                          }}
                        >
                          {genre}
                        </a>
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {book.title} ({book.release_year})
                  </h3>

                  <p className="mt-1.5 text-sm text-gray-700">{book.authors}</p>

                  {isLoggedIn && (
                    <form
                      action={`/carts/add/${book.id}`}
                      className="mt-4"
                      method="POST"
                    >
                      {/* <button className="text-white block w-full rounded bg-blue-700 p-4 text-sm font-medium transition hover:scale-105">
                        Add to Cart
                      </button> */}
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Market;

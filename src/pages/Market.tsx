import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
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

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="sticky top-0 bg-neutral z-50">
            <Navbar />
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className=" sm:flex sm:items-center sm:justify-between">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                    <svg
                      className="text-gray-600 h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 56.966 56.966"
                      width="512px"
                      height="512px"
                    >
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full md:w-80 px-10 h-10 rounded-l border-2 border-secondary  focus:ring-0 focus:border-primary"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                  <select
                    className="w-full h-10 border-2 focus:ring-0 focus:border-primary text-primary rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
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
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="School">School</option>
                    <option value="Vampires">Vampire</option>
                  </select>

                  {isLoggedIn && (
                    <a href="">
                      <div className="relative py-2">
                        <div className="t-0 absolute left-3">
                          <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-neutral">
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
              <li
                key={book.id}
                className="border-primary border-2 flex flex-col"
              >
                <a className="group relative block overflow-hidden">
                  <Link to={`/novel/${book.id}`}>
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                    />
                  </Link>
                </a>
                <div className="relative border  bg-neutral p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {book.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="text-neutral neutralspace-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
                        >
                          <a
                            href="#"
                            className="text-neutral relative text-[10px] w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-neutral after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-right"
                            onClick={(e) => {
                              e.preventDefault();
                              handleGenreClick(genre);
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

                    <p className="mt-1.5 text-sm text-gray-700">
                      {book.authors}
                    </p>
                  </div>

                  {isLoggedIn && (
                    <form
                      action={`/carts/add/${book.id}`}
                      className="mt-4"
                      method="POST"
                    >
                      <button className="text-neutral block w-full rounded bg-primary p-4 text-sm font-medium transition hover:scale-105">
                        Add to Cart
                      </button>
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

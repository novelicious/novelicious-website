import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layouts/Layout";

interface Book {
  id: number;
  cover: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string;
  cost: number;
}

const Market: React.FC = () => {
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        setBooks(res.data);
        setFilterData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [books, setBooks] = useState<Book[]>([]);
  const [filterData, setFilterData] = useState<Book[]>([]);

  const handleFilter = (value: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const res = filterData.filter((f) =>
        f.title.toLowerCase().includes(value)
      );
      setBooks(res);
      console.log(e.target.value);
    };
  };
  return (
    <Layout>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="w-1/2 backdrop-blur-sm bg-white/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-gray-100 focus:border-violet-300 transition-colors duration-300"
                    placeholder="Search..."
                    onChange={(e) => handleFilter(e.target.value)(e)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                  <a
                    href="#"
                    className="block rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring"
                  >
                    Cart
                  </a>
                </div>
              </div>
            </div>
          </header>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <li key={book.id}>
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
                  <span className="text-white whitespace-nowrap bg-blue-700 px-3 py-1.5 text-xs font-medium">
                    {book.genres}
                  </span>

                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {book.title} ({book.release_year})
                  </h3>

                  <p className="mt-1.5 text-sm text-gray-700">{book.authors}</p>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Rp.{book.cost}
                  </h3>

                  <form
                    action={`/carts/add/${book.id}`}
                    className="mt-4"
                    method="POST"
                  >
                    <button className="text-white block w-full rounded bg-blue-700 p-4 text-sm font-medium transition hover:scale-105">
                      Add to Cart
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Market;

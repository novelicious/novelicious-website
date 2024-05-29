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
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Layout>
      <div className="bg-blue-700 px-4 py-3 text-white">
        <p className="text-center text-sm font-medium">
          Love reading?
          <a href="#" className="inline-block underline">
            Check out this new book!
          </a>
        </p>
      </div>

      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Welcome, Guest
                  </h1>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Let's find your fav! 😋
                  </p>
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";

import { TailSpin } from "react-loader-spinner";
import BookItem, { Book } from "../components/BookItem";

const Favorites: React.FC = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Isi favorite
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      axios
        .get(`http://127.0.0.1:8000/users/${userId}/favorites`)
        .then((res) => {
          const ids: number[] = [];
          res.data.forEach((element: { id: number }) => {
            ids.push(element.id);
          });
          setFavs(ids);

          const transformedBooks = res.data.map(
            (book: Omit<Book, "genres"> & { genres: string | null }) => ({
              ...book,
              genres: book.genres
                ? book.genres.split(",").map((genre: string) => genre.trim())
                : [],
            })
          );
          setLoading(false);
          // getRecommendation();
          setFavoriteBooks(transformedBooks);
          console.log(transformedBooks);
        })
        .catch(() => {
          setError("Failed to fetch books data from favorites");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="black" />
      </div>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <Navbar />
          <div className="mx-auto max-w-screen-xl px-6 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mt-2">{/*  */}</div>
          </div>
        </header>

        {error ? (
          <>
            <p>{error}</p>
          </>
        ) : (
          <>
            {favoriteBooks.length == 0 ? (
              <>
                <p className="text-sm">no fav.</p>
              </>
            ) : (
              <>
                {" "}
                <h1 className="text-lg font-semibold">Your Favorites</h1>
                <ul
                  data-aos-anchor-placement="center-bottom"
                  className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {favoriteBooks.map((book) => (
                    <BookItem
                      id={book.id}
                      image={book.image}
                      title={book.title}
                      release_year={book.release_year}
                      authors={book.authors}
                      genres={book.genres}
                      cost={book.cost}
                      favs={favs}
                    />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Favorites;

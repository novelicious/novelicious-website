import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
interface Book {
  id: number;
  cover: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string;
  cost: number;
  synopsis: string;
  rating: number;
}

interface Question {
  answer: string;
}

const Details: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const { id } = useParams<{ id: string; questions: string }>();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (id && inputQuestion) {
      axios
        .get(
          `http://127.0.0.1:8000/ask/${id}?question=${encodeURIComponent(
            inputQuestion
          )}`
        )
        .then((res) => {
          setQuestion(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/books/" + id)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <img
              src={book.cover}
              alt=""
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
            />
            <div className="relative border border-gray-100 bg-white p-6">
              <span className="text-white whitespace-nowrap bg-blue-700 px-3 py-1.5 text-xs font-medium">
                {book.genres}
              </span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {book.title} ({book.release_year})
              </h3>
              <p className="mt-1.5 text-sm text-gray-700">⭐{book.rating}</p>
              <p className="mt-1.5 text-sm text-gray-700">{book.authors}</p>
              <p className="mt-1.5 text-sm text-gray-700">{book.synopsis}</p>
            </div>
          </div>
          <span className="flex items-center">
            <span className="h-px flex-1 bg-black"></span>
            <span className="shrink-0 px-6">Question Answering</span>
            <span className="h-px flex-1 bg-black"></span>
          </span>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="question"
              name="question"
              placeholder="fill with your idea."
              className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-4 inline-block rounded bg-blue-700 px-8 py-3 text-sm font-medium text-white transition hover:-rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-blue-700"
            >
              Answer
            </button>
          </form>{" "}
          <span className=" text-red-800">Answer: </span>
          {question && <p>{question.answer}</p>}
        </div>
      </section>
    </Layout>
  );
};

export default Details;

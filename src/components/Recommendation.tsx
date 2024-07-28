import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Star from "./FavStar";
import Add2CartButton from "./Add2Cart";
// import { FaStar, FaTrash } from "react-icons/fa";
// import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { StarRating } from "../pages/Details";
import { Review } from "../pages/Details";

export interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
  onGenreClick?: (genre: string) => void;
}

interface BookRecommendProps {
  isLoggedIn: boolean;
  favs: number[];
  recommendedBooks: Book[];
  onStarToggle: (id: number) => void;
  onStarUnToggle: (id: number) => void;
}

const Recommendation: React.FC<BookRecommendProps> = ({
  isLoggedIn,
  favs,
  recommendedBooks,
  onStarToggle,
  onStarUnToggle,
}) => {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full h-100vh">
      {recommendedBooks.length > 0 ? (
        recommendedBooks.map((book) => (
          <RecommendedBookItem
            key={book.id}
            {...book}
            isLoggedIn={isLoggedIn}
            favs={favs}
            onStarToggle={onStarToggle}
            onStarUnToggle={onStarUnToggle}
          />
        ))
      ) : (
        <div className="flex justify-center items-center min-h-full min-w-full">
          <TailSpin height={50} width={50} color="black" />
        </div>
      )}
    </ul>
  );
};

const RecommendedBookItem: React.FC<
  Book & {
    isLoggedIn: boolean;
    favs: number[];
    onStarToggle: (id: number) => void;
    onStarUnToggle: (id: number) => void;
  }
> = ({
  id,
  image,
  title,
  release_year,
  authors,
  genres,
  cost,
  isLoggedIn,
  favs,
  onStarToggle,
  onStarUnToggle,
}) => {
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/books/${id}/reviews`
        );

        const totalRating = res.data.reduce(
          (sum: number, review: Review) => sum + review.ratings,
          0
        );
        const avgRating = totalRating / res.data.length;
        setAverageRating(avgRating);
      } catch (err) {
        console.error("Error fetching book reviews:", err);
      }
    };

    fetchBookReviews();
  }, [id]);

  return (
    <li
      key={id}
      className="border-primary border-2 flex flex-col"
      data-aos="zoom-in"
    >
      <Link
        to={`/novel/${id}`}
        className="h-[320px] group relative block overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
        />
      </Link>

      <div className="relative border bg-neutral p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className=" text-sm text-gray-700 font-semibold">
            <p className="text-md font-bold">IDR{cost}</p>
          </div>
          <div className="flex flex-row items-center mb-4">
            <StarRating rating={averageRating} />
            <span className="px-2 font-semibold">
              {typeof averageRating === "number" && !isNaN(averageRating)
                ? averageRating
                : ""}
            </span>
          </div>

          <div className="w-full flex justify-between">
            <div className="flex flex-wrap gap-1">
              {genres.map((genre, index) => (
                <span
                  key={index}
                  className="text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
                >
                  <a
                    href="#"
                    className="text-neutral relative text-[10px] w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-neutral after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-right"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {genre}
                  </a>
                </span>
              ))}
            </div>
            {isLoggedIn ? (
              <Star
                toggled={favs.includes(id)}
                bookId={id}
                onToggled={() => onStarToggle(id)}
                onUntoggled={() => onStarUnToggle(id)}
                isShowText={false}
              />
            ) : (
              <></>
            )}
          </div>

          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {title} ({release_year})
          </h3>

          <p className="mt-1.5 text-sm text-gray-700">{authors}</p>
        </div>
        <div className="flex items-center justify-evenly">
          {isLoggedIn && <Add2CartButton id={id}></Add2CartButton>}
        </div>
      </div>
    </li>
  );
};

export default Recommendation;

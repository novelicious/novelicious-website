import { Link } from "react-router-dom";
import Star from "./FavStar";
import Add2CartButton from "./Add2Cart";
import toast from "react-hot-toast";
import { FaStar, FaTrash } from "react-icons/fa";
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

interface BookItem extends Book {
  favs: number[];
}

const BookItem: React.FC<BookItem> = ({
  id,
  image,
  title,
  release_year,
  authors,
  genres,
  cost,
  favs,
  onGenreClick,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const userId = localStorage.getItem("user_id");
  const [averageRating, setAverageRating] = useState<number>(0);
  // const [reviewCount, setReviewCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [userId]);

  const onStarToggledHandler = (bookId: number) => {
    toast.success("Sucessfully added to favorites!", {
      icon: <FaStar />,
    });
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .post(`http://127.0.0.1:8000/users/${userId}/setfav`, null, {
        params: {
          book_id: bookId,
        },
      })
      .catch((err) => console.log(err));
  };

  const onUntoggledHandler = (bookId: number) => {
    const userId = localStorage.getItem("user_id");
    toast.error("Removed from favorites!", {
      icon: <FaTrash />,
    });
    if (!userId) {
      console.log("User is not logged in.");
      return;
    }
    axios
      .post("http://127.0.0.1:8000/users/" + userId + "/removefav", null, {
        params: {
          book_id: bookId,
        },
      })
      // .then(() => {
      //   window.location.reload();
      // })
      .catch((err) => console.log(err));
  };
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
                      onGenreClick!(genre);
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
                onToggled={() => onStarToggledHandler(id)}
                onUntoggled={() => onUntoggledHandler(id)}
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
          <p className=" text-sm text-gray-700 font-semibold">IDR{cost}</p>

          <div className="flex flex-row items-center">
            <StarRating rating={averageRating} />
            <span className="px-2 font-semibold">
              {typeof averageRating === "number" && !isNaN(averageRating)
                ? averageRating
                : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-evenly">
          {isLoggedIn && <Add2CartButton id={id}></Add2CartButton>}
        </div>
      </div>
    </li>
  );
};

export default BookItem;

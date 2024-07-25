import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Book } from "./BookItem";
import Star from "./FavStar";
import Add2CartButton from "./Add2Cart";

interface BookRecommend {
  isLoggedIn: boolean;
  favs: number[];
  recommendedBooks: Book[];
  onStarToggle: (id: number) => void;
  onStarUnToggle: (id: number) => void;
}

const Recommendation: React.FC<BookRecommend> = ({
  isLoggedIn,
  favs,
  recommendedBooks,
  onStarToggle,
  onStarUnToggle,
}) => {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full h-100vh">
      {[0, 1, 2, 3].map((num) => (
        <li
          data-aos="fade-in"
          key={recommendedBooks.length > 0 ? recommendedBooks[num].id : num}
          className="border-primary border-2 flex flex-col"
        >
          {recommendedBooks.length > 0 ? (
            <>
              <Link
                to={`/novel/${recommendedBooks[num].id}`}
                className="h-[320px] group relative block overflow-hidden"
              >
                <img
                  src={recommendedBooks[num].image}
                  alt={recommendedBooks[num].title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
                />
              </Link>

              <div className="relative border bg-neutral p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="w-full flex justify-between">
                    <div className="flex flex-wrap gap-1">
                      {recommendedBooks[num].genres.map((genre, index) => (
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
                        toggled={favs.includes(recommendedBooks[num].id)}
                        bookId={recommendedBooks[num].id}
                        onToggled={() => onStarToggle(recommendedBooks[num].id)}
                        onUntoggled={() =>
                          onStarUnToggle(recommendedBooks[num].id)
                        }
                        isShowText={false}
                      />
                    ) : (
                      <></>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {recommendedBooks[num].title} (
                    {recommendedBooks[num].release_year})
                  </h3>

                  <p className="mt-1.5 text-sm text-gray-700">
                    {recommendedBooks[num].authors}
                  </p>
                  <p className=" text-sm text-gray-700 font-semibold">
                    IDR{recommendedBooks[num].cost}
                  </p>
                </div>
                <div className="flex items-center justify-evenly">
                  {isLoggedIn && (
                    <Add2CartButton
                      id={recommendedBooks[num].id}
                    ></Add2CartButton>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center min-h-full min-w-full">
              <TailSpin height={50} width={50} color="black" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Recommendation;

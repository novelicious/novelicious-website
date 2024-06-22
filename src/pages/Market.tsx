import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {CartProps, CartItemProps} from "./Cart";

interface Book {
  id: number;
  image: string;
  title: string;
  release_year: number;
  authors: string;
  genres: string[];
  cost: number;
}

const Market: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Filtering & Search
  const [filterData, setFilterData] = useState<Book[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage] = useState<number>(8);

  //Isi Cart
  const [cartAmount, setCartAmount] = useState<number>(0);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    axios
      .get("http://127.0.0.1:8000/books")
      .then((res) => {
        const transformedBooks = res.data.map(
          (book: Omit<Book, "genres"> & { genres: string | null }) => ({
            ...book,
            genres: book.genres
              ? book.genres.split(",").map((genre: string) => genre.trim())
              : [],
          })
        );
        setBooks(transformedBooks);
        setFilterData(transformedBooks);
      })
      .catch((err) => {
        console.log(err);
      });

    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const filteredBooks = filterData.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedGenres.length === 0 ||
          selectedGenres.every((genre) => book.genres.includes(genre)))
    );
    setBooks(filteredBooks);
    setCurrentPage(1);
  }, [searchQuery, selectedGenres, filterData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  useEffect(()=>{
    const userId = sessionStorage.getItem("user_id");
     axios.get("http://127.0.0.1:8000/users/"+userId+"/cart")
     .then((res) => {
      const cartData = res.data;
      setCartAmount(getCartAmount(cartData));
    })
    .catch((err) => {
      console.log(err);
    });;

  }, [])
  function getCartAmount(cart: CartProps){
    if(cart == null) return 0;
    var amount = 0;
    var books : CartItemProps[] = cart.books;
    books.forEach(book => {
      amount += book.amount;
    }); 
    return amount;
  }


  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };
  const addToCartHandler = (bookId : number, quantity : number)=>{
    
    const userId = sessionStorage.getItem("user_id");
    axios.post("http://127.0.0.1:8000/carts/add", null, {params :{
      "book_id":bookId,
      "user_id":userId,
      "amount":quantity
    }});
    setTimeout(()=>{
      setCartAmount(cartAmount + quantity);

    }, 300);


  };

  const clearGenres = () => {
    setSelectedGenres([]);
  };

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
  const Add2CartButton : React.FC<Book> = ({id})=>{
    const [clicked, setClicked] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    /*if(!clicked)return (
    <button
      onClick={()=>{setClicked(true);}} 
      className="text-neutral block w-full rounded bg-primary p-4 text-sm font-medium transition hover:scale-105">
        Add to Cart
    </button>
    )*/
   var size = clicked? "w-full" : "w-0"
    return(
      <div className="flex">
      <button 
        onClick={
          ()=>{setClicked(!clicked);}
        } 
        className="text-neutral block w-full rounded bg-primary p-4 text-sm font-medium transition-all duration:500 ease-in-out hover:scale-105 active:scale-95">
          {clicked? "X" : "Buy"}
      </button>
      <div className={size+" h-full transition-all duration:500 ease-in-out"}>
        <input type="number" min= "1"
        id={`qty-${id}`}
        defaultValue={quantity}
        onChange={(e)=>{setQuantity(parseInt(e.target.value));}}
        className="w-full h-full items-center justify-center rounded block border-gray-200 bg-gray-50 p-2 text-center text-large text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      <button
        onClick={()=>{
          setClicked(false);
          addToCartHandler(id, quantity); 
        }} 
        className={size + " text-neutral block rounded bg-primary" + (clicked? " p-4 " : " p-0 ") + "text-sm font-medium transition-all duration:500 ease-in-out hover:scale-105 active:scale-95"}>
          {clicked? "OK" : ""}
      </button>

      </div>

    );
      
  }

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
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
                    className="w-full h-10 border-2 border-secondary  focus:ring-0 focus:border-primary text-primary rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                    onChange={(e) => handleGenreChange(e.target.value)}
                    value=""
                  >
                    <option value="" disabled>
                      Select Genre
                    </option>
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
                    {/* add lagi aja ntar */}
                  </select>

                  {isLoggedIn && (
                    <Link to={`/cart`}>
                      <div className="relative py-2">
                        <div className="t-0 absolute left-3">
                          <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-neutral">
                            {cartAmount}
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
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre, index) => (
              <span
                data-aos="zoom-in"
                key={index}
                className="text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
              >
                {genre}
                <button
                  className="ml-2"
                  onClick={() => handleGenreChange(genre)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {selectedGenres.length > 0 && (
            <button
              data-aos="fade-in"
              className="mt-2 text-neutral space-nowrap bg-primary px-3 py-1.5 text-xs font-medium"
              onClick={clearGenres}
            >
              Clear Genres
            </button>
          )}
          <ul
            data-aos-anchor-placement="center-bottom"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {currentBooks.map((book) => (
              <li
                key={book.id}
                className="border-primary border-2 flex flex-col"
                data-aos="zoom-in"
              >
                <Link
                  to={`/novel/${book.id}`}
                  className="h-[320px] group relative block overflow-hidden"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[320px]"
                  />
                </Link>

                <div className="relative border bg-neutral p-6 flex-grow flex flex-col justify-between">
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
                    <Add2CartButton id={book.id} image={book.image} title={book.title} release_year={book.release_year} authors={book.authors} genres={book.genres} cost={book.cost} ></Add2CartButton>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-8">
            {books.length === 0 ? (
              <div className="text-center mt-8">
                <div className="flex justify-center items-center h-96">
                  <div
                    className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-4 rounded-full"
                    role="status"
                  >
                    <span className="visually-hidden">:v</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
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

                  {pageNumbers.map((number) => (
                    <li key={number}>
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

                  <li>
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
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Market;

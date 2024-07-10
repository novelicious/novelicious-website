import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiHouseLine } from "react-icons/pi";
import { CiPhone } from "react-icons/ci";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  title_eng: string;
  authors: string;
  image: string;
  genres: string;
  book_type: string;
  cost: number;
  stock: number | null;
  amount: number;
}

interface Cart {
  id: number;
  user_id: number;
  amount: number | null;
  cost: number | null;
  created_at: string;
  books: Book[];
}

interface CheckoutData {
  cart_id: number;
  created_at: string;
  id: number;
  status: string;
  total_amount: number;
  total_cost: number;
  updated_at: string;
  user_id: number;
}

interface User {
  username: string;
  picture: string | null;
  id: number;
  role_id: number;
  age: number;
  gender: string;
  birth_year: number;
  active_cart_id: number | null;
}

const Checkout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const location = useLocation();
  const id = location.state?.id;
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    if (id) {
      axios
        .get<Cart>(`http://127.0.0.1:8000/carts/16`)
        .then((res) => {
          console.log("Cart data:", res.data);
          setCart(res.data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }

    if (userId) {
      axios
        .get<User>(`http://127.0.0.1:8000/users/${userId}`)
        .then((res) => {
          console.log("User data:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (id) {
      axios
        .get<CheckoutData>(`http://127.0.0.1:8000/checkouts/${id}`)
        .then((res) => {
          console.log("Checkout data:", res.data);
          setCheckout(res.data);
        })
        .catch((error) => {
          console.error("Error fetching checkout data:", error);
        });
    }
  }, [id, userId]);

  useEffect(() => {
    if (cart && user && checkout) {
      setLoading(false);
    }
  }, [cart, user, checkout]);

  return (
    <section>
      <div>
        <Toaster />
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <div className="flex items-center">
            <Link to="/cart">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Checkout</h1>
          </div>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
              {loading ? (
                <div className="text-center mt-8">
                  <div className="flex justify-center items-center h-96">
                    <div
                      className="spinner-border border-primary animate-spin inline-block w-8 h-8 border-4 rounded-full"
                      role="status"
                    >
                      <span className="visually-hidden">:3</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Sent to:</h3>
                    <div className="flex items-center">
                      <CiUser />
                      <p className="mx-2">{user?.username}</p>
                    </div>
                    <div className="flex items-center">
                      <PiHouseLine />
                      <p className="mx-2">Jl.Tanjung Duren Selatan</p>
                    </div>
                    <div className="flex items-center">
                      <CiPhone />
                      <p className="mx-2">+62xxx</p>
                    </div>
                  </div>
                  <hr />
                  <div>
                    {cart && cart.books && cart.books.length > 0 ? (
                      <ul className="space-y-4">
                        {cart.books.map((book) => (
                          <div
                            key={book.id}
                            className="flex items-center space-x-4 p-4 border-b"
                          >
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-20 h-20 object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {book.title}
                              </h3>
                              <p className="text-gray-600">{book.authors}</p>
                              <p className="text-gray-800 font-semibold">
                                Rp. {book.cost}
                              </p>
                            </div>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p>No books in the cart</p>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                    <select className="w-full p-2 border rounded">
                      <option>GOJEK (Rp.9000)</option>
                      <option>Grab (Rp.9000)</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Payment Method
                    </h3>
                    <select className="w-full p-2 border rounded">
                      <option>PayPal</option>
                      <option>BCA</option>
                    </select>
                  </div>

                  <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                    <div className="w-screen max-w-lg space-y-4">
                      <dl className="space-y-0.5 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <dt>Subtotal</dt>
                          <dd>IDR {checkout?.total_cost}</dd>
                        </div>
                        <div className="flex justify-between !text-base font-medium">
                          <dt>Total</dt>
                          <dd>IDR {checkout?.total_cost}</dd>
                        </div>
                      </dl>
                      <div className="flex justify-end">
                        <button className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm">
                          Next (Transactions)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Checkout;

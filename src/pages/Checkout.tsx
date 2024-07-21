import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiHouseLine } from "react-icons/pi";
import { CiPhone } from "react-icons/ci";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

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
  address: string;
  birth_year: number;
  active_cart_id: number | null;
}

interface ProviderCost {
  provider: string;
  cost: number;
}

const Checkout: React.FC = () => {
  const shipMethod: Array<ProviderCost> = [
    { provider: "Gojek", cost: 9000 },
    { provider: "Grab", cost: 10000 },
  ];

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [shipping, setShipping] = useState<ProviderCost>(shipMethod[0]);
  const [payment, setPayment] = useState<String>("PayPal");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // const cart_id = location.state?.cart_id;
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
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
    if (checkout) {
      axios
        .get<Cart>(`http://127.0.0.1:8000/carts/${checkout.cart_id}`)
        .then((res) => {
          console.log("Cart data:", res.data);
          setCart(res.data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [checkout]);

  useEffect(() => {
    if (cart && user && checkout) {
      setLoading(false);
    }
  }, [cart, user, checkout]);

  const transactionHandler = () => {
    axios
      .post(`http://127.0.0.1:8000/checkouts/${id}/checkout`, null, {
        params: {
          shipping_fee: shipping.cost,
          shipping: shipping.provider,
          payment: payment,
        },
      })
      .then(() => {
        // navigate(`/transaction/${id}`);
        navigate(`/transactions`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="black" />
      </div>
    );
  }

  return (
    <section>
      <div>
        <Toaster />
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0  z-50">
          <div className=" flex items-center">
            <Link to="/cart">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Checkout</h1>
          </div>
          <div className="mx-auto bg-white  max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mt-8">
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Sent to:</h3>
                  <div className="flex items-center">
                    <CiUser />
                    <p className="mx-2">{user?.username}</p>
                  </div>
                  <div className="flex items-center">
                    <PiHouseLine />
                    <p className="mx-2">{user?.address}</p>
                  </div>
                  <div className="flex items-center">
                    <CiPhone />
                    <p className="mx-2">+628788287214</p>
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
                              IDR {book.cost.toLocaleString("id-ID")} x{" "}
                              {book.amount}
                            </p>
                            <p className="text-gray-800 font-bold">
                              Subtotal: IDR{" "}
                              {(book.cost * book.amount).toLocaleString(
                                "id-ID"
                              )}
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
                  <select
                    className="w-full p-2 border rounded"
                    defaultValue={0}
                    onChange={(e) =>
                      setShipping(shipMethod[parseInt(e.target.value)])
                    }
                  >
                    {shipMethod.map((ship, index) => (
                      <option value={index} key={index}>
                        {ship.provider} (IDR {ship.cost.toLocaleString("id-ID")}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <select
                    className="w-full p-2 border rounded"
                    defaultValue={"PayPal"}
                    onChange={(e) => {
                      setPayment(e.target.value.toString());
                    }}
                  >
                    <option value={"PayPal"}>PayPal</option>
                    <option value={"BCA"}>BCA</option>
                  </select>
                </div>

                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Items Subtotal</dt>
                        <dd>
                          IDR{" "}
                          {checkout?.total_cost
                            ? (checkout?.total_cost).toLocaleString("id-ID")
                            : 0}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Shippment Subtotal</dt>
                        <dd>IDR {shipping.cost.toLocaleString("id-ID")}</dd>
                      </div>
                      <div className="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>
                          IDR{" "}
                          {checkout?.total_cost
                            ? (
                                checkout?.total_cost + shipping.cost
                              ).toLocaleString("id-ID")
                            : 0}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex justify-end">
                      <button
                        className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
                        onClick={transactionHandler}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Checkout;

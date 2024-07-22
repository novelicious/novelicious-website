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
  id: number;
  provider: string;
  cost: number;
}

const Checkout: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [transaction, setCheckout] = useState<CheckoutData | null>(null);
  const [shipping, setShipping] = useState<number>(1)
  const [payment, setPayment] = useState<number>(1)
  const [allShipping, setAllShipping] = useState<ProviderCost[] | null>(null);
  const [allPayment, setAllPayment] = useState<ProviderCost[] | null>(null);
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
        .get<CheckoutData>(`http://127.0.0.1:8000/transactions/${id}`)
        .then((res) => {
          console.log("Checkout data:", res.data);
          setCheckout(res.data);
        })
        .catch((error) => {
          console.error("Error fetching transaction data:", error);
        });
    }

    axios
      .get<ProviderCost[]>(`http://127.0.0.1:8000/deliveries`)
      .then((res) => {
        setAllShipping(res.data)
      })
      .catch(error => {
        console.error('Error fetching deliveries method data:', error);
      })

    axios
      .get<ProviderCost[]>(`http://127.0.0.1:8000/payments`)
      .then((res) => {
        setAllPayment(res.data)
      })
      .catch(error => {
        console.error('Error fetching payments method data:', error);
      })
  }, [id, userId]);

  useEffect(() => {
    if (transaction) {
      axios
        .get<Cart>(`http://127.0.0.1:8000/carts/${transaction.cart_id}`)
        .then((res) => {
          console.log("Cart data:", res.data);
          setCart(res.data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [transaction]);

  useEffect(() => {
    if (cart && user && transaction) {
      setLoading(false);
    }
  }, [cart, user, transaction]);

  const transactionHandler = () => {
    axios
      .put(`http://127.0.0.1:8000/transactions/${id}/checkout`, null, {
        params: {
          shipping: shipping,
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
                      setShipping(parseInt(e.target.value))
                    }
                  >
                    {allShipping?.map((ship) => (
                      <option value={ship.id} key={ship.id}>
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
                      setPayment(parseInt(e.target.value));
                    }}
                  >
                    {allPayment?.map((payment) => (
                      <option value={payment.id} key={payment.id}>
                        {payment.provider} (IDR {payment.cost.toLocaleString("id-ID")}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Items Subtotal</dt>
                        <dd>
                          IDR{" "}
                          {transaction?.total_cost
                            ? (transaction?.total_cost).toLocaleString("id-ID")
                            : 0}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Shippment Subtotal</dt>
                        <dd>
                          IDR {allShipping && allShipping[shipping - 1].cost.toLocaleString("id-ID")}
                          </dd>
                      </div>
                      <div className="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>
                          IDR{" "}
                          {transaction && allShipping
                            && (
                                transaction?.total_cost + allShipping[shipping - 1].cost
                              ).toLocaleString("id-ID")}
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

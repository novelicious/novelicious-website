import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  title_eng: string;
  authors: string;
  image: string;
  cost: number;
  amount: number;
}

interface Cart {
  id: number;
  user_id: number;
  amount: number | null;
  cost: number | null;
  books: Book[];
}

interface CheckoutData {
  cart_id: number;
  id: number;
  status: string;
  shipping: string | null;
  payment: string | null;
  shipping_fee: number;
  total_amount: number;
  total_cost: number;
  user_id: number;
  updated_at: string;
  created_at: string;
}

const Transaction : React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [cart, setCart] = useState<Cart | null>(null)
  const splitted = checkout?.updated_at.split('-')
  const vaNumber1 = splitted ? parseInt(splitted[0])+parseInt(splitted[1])+parseInt(splitted[2].substring(0,2)) : 0;
  const vaNumber2 = vaNumber1 && checkout ? (vaNumber1 + checkout.shipping_fee).toString() : 0;
  const vaNumber3 = checkout && vaNumber1 ? (vaNumber1 + checkout.total_cost): 0
  const vaNumberFinal = vaNumber1 && vaNumber2 && vaNumber3 ? (vaNumber1 + vaNumber3).toString() + vaNumber2: ''
  const { id } = useParams<{ id: string }>()
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get<CheckoutData>(`http://127.0.0.1:8000/checkouts/${id}`)
        .then((res) => {
          console.log("Checkout data:", res.data);
          if (userId && parseInt(userId) != res.data.user_id) {
            navigate('/market')
          }
          setCheckout(res.data)
        })
        .catch((error) => {
          console.error("Error fetching checkout data:", error);
          navigate('/transactions')
        });
    }
  }, [id])

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
  }, [checkout])

  useEffect(() => {
    if (checkout) {
      setLoading(false);
    }
  })

  const payHandler = () => {
    
  }

  return (
    <section>
      <div>
        <Toaster />
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <div className="flex items-center">
            <Link to="/transactions">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Transaction Detail</h1>
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
              <div className="mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <dt>Total</dt>
                  <dd className="font-bold">IDR {
                    checkout ? 
                      (checkout.total_cost + checkout.shipping_fee).toLocaleString('id-ID')
                    : 0}
                  </dd>
                </div>
                <div className="mt-6 flex justify-between">
                  <h3 className="text-lg font-semibold mb-2">
                    Payment Method
                  </h3>
                  <p>{checkout?.payment}</p>
                </div>
                <div className="mt-2 font-semibold text-lg flex justify-between">
                  <h2>Virtual Account Number</h2>
                  <div className="mb-3 p-2 bg-white rounded-lg flex justify-between">
                    <h2 className="text-4xl">NVLCS { vaNumberFinal? vaNumberFinal.substring(0,10) : ''}</h2>
                    <button className="ml-4 inline-flex text-gray-800 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-sm"
                      onClick={() => navigator.clipboard.writeText('NVLCS'+vaNumberFinal.substring(0,10))}>
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex justify-end mt-5 mb-5 space-y-4">
                  <button className="ml-4 w-full font-semibold inline-flex justify-center text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded"
                    onClick={payHandler}>
                    Pay
                  </button>
                </div>
                <div className="flex justify-end mt-5 mb-5 space-y-4">
                  <button className="ml-4 w-full text-gray-800 font-semibold inline-flex justify-center bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded"
                    onClick={() => navigate(`/checkout/${id}`)}>
                    Edit Shipping and Payment Provider
                  </button>
                </div>
                <hr />
                <h3 className="text-lg font-semibold mb-2">
                  Cost Detail
                </h3>
                <div className="ml-5">
                  <div className="mt-6 flex justify-between">
                    <h2 className="mb-2 font-semibold">Shipping</h2>
                    <div className="w-2/3 text-sm">
                      <div className="flex justify-between">
                        <p>Provider</p>
                        <p>{checkout?.shipping}</p>
                      </div>
                      <div className="flex justify-between">
                        <h4>Estimation</h4>
                        <p>4 Days</p>
                      </div>
                      <div className="flex justify-between">
                        <p>Shipping Fee</p>
                        <p className="font-bold mb-2 text-md">
                          IDR {checkout?.shipping_fee.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <h2 className="text-lg font-semibold mt-2">Items</h2>
                  <div>
                    {cart && cart.books && cart.books.length > 0 ? (
                      <ul className="space-y-4">
                        {cart.books.map((book) => (
                          <div
                            key={book.id}
                            className="flex items-center space-x-4 p-3 border-b"
                          >
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-20 h-20 object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="text-md font-semibold">
                                {book.title}
                              </h3>
                              <p className="text-gray-600 text-sm">{book.authors}</p>
                              <div className="flex justify-between">
                                <p className="text-gray-800 font-semibold">
                                  IDR {book.cost.toLocaleString('id-ID')} x {book.amount}
                                </p>
                                <p className="text-gray-800 font-bold">
                                  IDR {(book.cost * book.amount).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p>No books in the cart</p>
                    )}
                    <div className="space-y-4 m-3 font-semibold">
                      <dl className="space-y-0.5 text-gray-700">
                        <div className="flex justify-between">
                          <dt>Items Subtotal</dt>
                          <dd>IDR {
                            checkout?.total_cost ? (checkout?.total_cost).toLocaleString('id-ID') : 0
                            }</dd>
                        </div>
                      </dl>
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
}

export default Transaction;
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

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

interface TransactionData {
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

const Transaction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const splitted = transaction?.updated_at.split("-");
  const vaNumber1 = splitted
    ? parseInt(splitted[0]) +
      parseInt(splitted[1]) +
      parseInt(splitted[2].substring(0, 2))
    : 0;
  const vaNumber2 =
    vaNumber1 && transaction
      ? (vaNumber1 + transaction.shipping_fee).toString()
      : 0;
  const vaNumber3 =
    transaction && vaNumber1 ? vaNumber1 + transaction.total_cost : 0;
  const vaNumberFinal =
    vaNumber1 && vaNumber2 && vaNumber3
      ? (vaNumber1 + vaNumber3).toString() + vaNumber2
      : "";
  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get<TransactionData>(`http://127.0.0.1:8000/transactions/${id}`)
        .then((res) => {
          console.log("Transaction data:", res.data);
          if (userId && parseInt(userId) !== res.data.user_id) {
            navigate("/market");
          }
          setTransaction(res.data);
        })
        .catch((error) => {
          console.error("Error fetching transaction data:", error);
          navigate("/transactions");
        });
    }
  }, [id]);

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
    if (transaction) {
      setLoading(false);
    }
  });

  const payHandler = () => {
    if (transaction) {
      const updatedTransaction = {
        total_amount: transaction.total_amount,
        total_cost: transaction.total_cost,
        status: transaction.status === "Shipping" ? "Delivered" : "Shipping",
      };

      axios
        .put(
          `http://127.0.0.1:8000/transactions/${transaction.id}`,
          updatedTransaction
        )
        .then(() => {
          setTransaction({
            ...transaction,
            status: updatedTransaction.status,
          });
          toast.success(
            `Status updated to ${
              updatedTransaction.status === "Shipping"
                ? "Shipping"
                : "Delivered"
            }.`
          );
          navigate("/transactions");
        })
        .catch((error) => {
          console.error("Error updating status:", error);
          toast.error("Failed to update status.");
        });
    }
  };

  const deleteHandler = () => {
    if (transaction) {
      axios
        .delete(`http://127.0.0.1:8000/transactions/${transaction.id}`)
        .then(() => {
          toast.success("Transaction has been finished.");
          navigate("/transactions");
        })
        .catch((error) => {
          console.error("Error deleting transaction:", error);
          toast.error("Failed to finish transaction.");
        });
    }
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
          <div className="flex items-center">
            <Link to="/transactions">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-bold">Transaction Detail</h1>
          </div>
          <div className="mx-auto bg-white shadow-lg max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <dt>Total</dt>
                  <dd className="font-bold">
                    IDR{" "}
                    {transaction
                      ? (
                          transaction.total_cost + transaction.shipping_fee
                        ).toLocaleString("id-ID")
                      : 0}
                  </dd>
                </div>
                <div className="mt-6 flex justify-between">
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <p>{transaction?.payment}</p>
                </div>
                <div className="mt-2 font-semibold text-lg flex justify-between">
                  {transaction?.status == "Pending" ? (
                    <>
                      <h2>Virtual Account Number</h2>
                      <div className="mb-3 p-2 bg-white rounded-lg flex justify-between">
                        <h2 className="text-4xl">
                          NVLCS{" "}
                          {vaNumberFinal ? vaNumberFinal.substring(0, 10) : ""}
                        </h2>
                        <button
                          className="ml-4 inline-flex text-gray-800 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-sm"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              "NVLCS" + vaNumberFinal.substring(0, 10)
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2>Payment Date</h2>
                      <p className="text-lg">
                        {transaction &&
                          new Date(transaction?.updated_at).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                {transaction?.status !== "Delivered" && (
                  <div className="flex justify-end mt-5 mb-5 space-y-4">
                    <button
                      className="ml-4 w-full font-semibold inline-flex justify-center text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded"
                      onClick={payHandler}
                    >
                      {transaction?.status === "Shipping" ? "Done" : "Pay"}
                    </button>
                  </div>
                )}
                {transaction?.status === "Delivered" && (
                  <div className="flex justify-end mt-5 mb-5 space-y-4">
                    <button
                      className="ml-4 w-full font-semibold inline-flex justify-center text-neutral bg-primary border-0 py-2 px-6 focus:outline-none  rounded"
                      onClick={deleteHandler}
                    >
                      Delete Record
                    </button>
                  </div>
                )}

                <div className="flex justify-end mt-5 mb-5 space-y-4">
                  {transaction?.status === "Pending" && (
                    <button
                      className="ml-4 w-full text-gray-800 font-semibold inline-flex justify-center bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded"
                      onClick={() => navigate(`/checkout/${id}`)}
                    >
                      Edit Shipping and Payment Provider
                    </button>
                  )}
                </div>
                <hr />
                <h3 className="text-lg font-semibold mb-2">Cost Detail</h3>
                <div className="ml-5">
                  <div className="mt-6 flex justify-between">
                    <h2 className="mb-2 font-semibold">Shipping</h2>
                    <div className="w-2/3 text-sm">
                      <div className="flex justify-between">
                        <p>Provider</p>
                        <p>{transaction?.shipping}</p>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p>Fee</p>
                        <p>
                          IDR{" "}
                          {transaction?.shipping_fee.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="font-semibold">Total Cost</p>
                    <p className="font-bold">
                      IDR{" "}
                      {transaction
                        ? (
                            transaction.total_cost + transaction.shipping_fee
                          ).toLocaleString("id-ID")
                        : 0}
                    </p>
                  </div>
                </div>
                <hr />
                <h2 className="text-lg font-semibold mt-2">Books</h2>
                <div className="ml-5">
                  <div className="mt-6">
                    {cart?.books.length ? (
                      <ul className="divide-y divide-gray-200">
                        {cart.books.map((book) => (
                          <div
                            key={book.id}
                            className="flex justify-between items-center py-2"
                          >
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold">
                                {book.title}
                              </h4>
                              <p>{book.authors}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                IDR {book.cost.toLocaleString("id-ID")}
                              </p>
                              <p className="text-sm">x{book.amount}</p>
                            </div>
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p>No items in the cart.</p>
                    )}
                  </div>
                </div>
                <hr />
                <h2 className="text-lg font-semibold mt-2">
                  Billing Information
                </h2>
                <div className="ml-5">
                  <div className="mt-6 flex justify-between">
                    <p className="font-semibold">Amount</p>
                    <p>{transaction?.total_amount}</p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="font-semibold">Order Date</p>
                    <p>{transaction?.created_at}</p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="font-semibold">Total Cost</p>
                    <p className="font-bold">
                      IDR {transaction?.total_cost.toLocaleString("id-ID")}
                    </p>
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

export default Transaction;

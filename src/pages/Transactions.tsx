import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FaShoppingBag } from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  title_eng: string;
  image: string;
  cost: number | null;
  amount: number;
}

interface Cart {
  id: number;
  user_id: number;
  amount: number | null;
  cost: number | null;
  books: Book[];
}

interface TransactionItemProps {
  id: number;
  cart_id: number;
  total_amount: number;
  total_cost: number;
  status: string;
  created_at: string;
  userId?: string;
  shipping_fee: number;
  onRemoveItem?: (id: number) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  id,
  cart_id,
  created_at,
  status,
  total_cost,
  shipping_fee,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    if (cart_id) {
      axios
        .get<Cart>(`http://127.0.0.1:8000/carts/${cart_id}`)
        .then((res) => {
          console.log("Cart data:", res.data);
          setCart(res.data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [cart_id, status]);

  const totalPrice = total_cost + shipping_fee;

  return (
    <div className="sm:flex sm:justify-center">
      <li className="flex sm:w-1/2 gap-4 mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <Link
          to={`/transaction/${id}`}
          className="flex items-center justify-center w-full h-full"
        >
          <div className="flex flex-col flex-1">
            <div className="flex gap-x-2 items-center">
              <FaShoppingBag />
              <p>Shopping</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-semibold">
                {new Date(created_at).toLocaleString()}
              </h3>
            </div>
            <hr />
            <div className="flex flex-wrap gap-4 mt-2">
              {cart?.books.slice(0, 1).map((book) => (
                <div key={book.id} className="flex items-center gap-2">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="text-md text-gray-900">{book.title}</h3>
                    <h3 className="text-md text-gray-900">
                      {book.amount} item
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <div className={`status-tag status-${status.toLowerCase()}`}>
              {cart && cart.books.length > 1 && (
                <span className="text-md text-gray-500">
                  +{cart.books.length - 1} others
                </span>
              )}
              <p>Total Price</p>
              <p className="font-semibold">
                IDR {totalPrice.toLocaleString("id-ID")}{" "}
              </p>
            </div>
          </div>
        </Link>
      </li>
    </div>
  );
};

const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<
    TransactionItemProps[] | null
  >(null);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/users/${userId}/checkouts`)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch();
  }, [navigate, userId]);

  const filteredTransactions = transactions?.filter(
    (transaction) => transaction.status === activeTab
  );

  const deleteHandler = (id: number) => {
    console.log(id, "deleted");
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
            <Link to="/">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Transactions</h1>
          </div>
        </header>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 ${
              activeTab === "pending" ? "border-b-2 border-primary" : ""
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 ${
              activeTab === "shipping" ? "border-b-2 border-primary" : ""
            }`}
          >
            Shipping
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`px-4 py-2 ${
              activeTab === "done" ? "border-b-2 border-primary" : ""
            }`}
          >
            Done
          </button>
        </div>
        <div className="mt-8">
          <ul className="space-y-4">
            {filteredTransactions?.map((item) => (
              <TransactionItem
                key={item.id}
                id={item.id}
                cart_id={item.cart_id}
                status={item.status}
                created_at={item.created_at}
                shipping_fee={item.shipping_fee}
                total_amount={item.total_amount}
                total_cost={item.total_cost}
                userId={userId ?? ""}
                onRemoveItem={deleteHandler}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Transactions;

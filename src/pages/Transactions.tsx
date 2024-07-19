import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"
import { FaRegTrashAlt } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom"

interface Book {
  id: number;
  title: string;
  title_eng: string;
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

interface TransactionItemProps {
  id: number;
  cart_id: number;
  total_amount: number;
  total_cost: number;
  status: string;
  created_at: string;
  userId?: string;
  onRemoveItem?: (id: number) => void;
}

const TransactionItem : React.FC<TransactionItemProps> = ({
  id, 
  cart_id,
  total_amount,
  total_cost,
  created_at,
  status,
  userId,
  onRemoveItem
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [statColor, setStatColor] = useState<string>('#57C11A');

  const removeHandler = () => {
    if (onRemoveItem) onRemoveItem(id);
  };
  
  useEffect(() => {
    switch (status) {
      case 'pending':
        setStatColor('#2E8DCF');
        break;
      case 'awaiting payment':
        setStatColor('#EBA910');
        break;
      case 'cancelled':
        setStatColor('#D71919');
        break;
      default:
        setStatColor('#57C11A');
        break;
    }
    if (cart_id){
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
    console.log(statColor);
    
    
  }, [])

  return (
      <li className="flex items-center gap-4 mb-4">
        <Link
          to={`/transaction/${id}`}
          className="items-center gap-4 w-full h-full origin-left transition-all duration-500 ease-in-out hover:scale-105 active:scale-95"
        >
          <div className="flex justify-between">
            <h3 className="text-semibold">{created_at}</h3>
            <h3 className={`py-1 px-2 rounded text-` + statColor}>{status}</h3>
          </div>
          <div className="flex justify-center">
            {cart?.books.map((book) => (
              <div className="" key={book.id}>
                <img src={book.image} alt={book.title} className="size-20 rounded object-cover" />
                <div>
                  <h3 className="text-md text-gray-900">{book.title}</h3>
                  <dl className="mt-0.5 space-y-px text-[12px] text-gray-600">
                    <div>
                      <dd className="inline">IDR {(book.cost).toLocaleString('id-ID') }</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-2">
          <button
            className="text-gray-600 transition hover:text-red-600"
            onClick={removeHandler}
          >
            <span className="sr-only">Remove item</span>
            <FaRegTrashAlt />
          </button>
        </div>
      </li>
    );
}

const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionItemProps[] | null>(null);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/users/${userId}/checkouts`)
      .then(res => {
        setTransactions(res.data);
        console.log(res.data);
        
      })
      .catch(

      )
  }, [navigate, userId])

  useEffect(() => {
    setLoading(true)
    if (transactions){
      setLoading(false)
    }
  }, [transactions])

  const deleteHandler = (id: number) => {
    console.log(id, 'deleted');
  }
  
  return (
    <section>
      <div>
        <Toaster />
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
        <header className="sticky top-0 bg-neutral z-50">
          <div className="flex items-center">
            <Link to="/">
              <IoMdArrowRoundBack />
            </Link>
            <h1 className="ml-5 text-md font-semibold">Transactions</h1>
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
                  <ul className="space-y-4">
                    {transactions?.map((item) => (
                      <TransactionItem
                        key={item.id}
                        id={item.id}
                        cart_id={item.cart_id}
                        status={item.status}
                        created_at={item.created_at}
                        total_amount={item.total_amount}
                        total_cost={item.total_cost}
                        userId={userId ?? ""}
                        onRemoveItem={deleteHandler}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </section>
  )
}

export default Transactions;
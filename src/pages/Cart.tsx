import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
export interface CartItemProps {
  id: number;
  title: string;
  authors: string;
  image: string;
  genres: string;
  amount: number;
  cost: number;
}

export interface CartProps {
  books: CartItemProps[];
  amount: number;
  created_at: string;
}

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // const [cart, setCart] = useState<CartProps>();
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const [cost, setCost] = useState<number>(0);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");
  const updateCost = () => {
    var c = 0;
    console.log("Updating Cost");
    cartItems.forEach((item) => {
      c += item.cost * item.amount;
    });
    console.log(c);
    setCost(c);
  };
  const getCartItems = () => {
    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/cart")
      .then((res) => {
        const cartData = res.data;
        console.log(res);
        console.log(res.data);
        // console.log(cartData);
        // setCart(cartData);
        setCartItems(cartData.books);
        setLoading(false);
        updateCost();
      })
      .catch((err) => {
        console.log(err);
        navigate("/market");
      });
  };
  useEffect(() => {
    getCartItems();

    return () => {};
  }, [navigate, userId]);

  const checkoutHandler = () => {
    axios
      .post("http://127.0.0.1:8000/carts/buy", null, {
        params: { user_id: userId },
      })
      .then((res) => {
        // Navigate to the market page with a toast message parameter
        //navigate("/market?toast=checkout_success");
        const checkout_id = res.data.id;
        navigate("/checkout", { state: { id: checkout_id }, replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteHandler = (id: number) => {
    toast.error("Removed from cart!", {
      icon: <FaTrash />,
    });
    setCartItems(cartItems.filter((item) => item.id !== id));
    axios
      .post("http://127.0.0.1:8000/carts/remove", null, {
        params: {
          user_id: userId,
          book_id: id,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateHandler = () => {
    getCartItems();
    updateCost();
  };

  return (
    <>
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
              <h1 className="ml-5 text-md font-semibold">Cart</h1>
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
                      {cartItems.map((item) => (
                        <CartItem
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          authors={item.authors}
                          image={item.image}
                          genres={item.genres}
                          amount={item.amount}
                          userId={userId ?? ""}
                          onRemoveItem={() => deleteHandler(item.id)}
                          onUpdateItem={() => updateHandler()}
                        />
                      ))}
                    </ul>

                    <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                      <div className="w-screen max-w-lg space-y-4">
                        <dl className="space-y-0.5 text-sm text-gray-700">
                          <div className="flex justify-between !text-base font-medium">
                            <dt>Total</dt>
                            <dd>IDR{cost}</dd>
                          </div>
                        </dl>
                        <div className="flex justify-end">
                          <button
                            onClick={checkoutHandler}
                            className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm"
                          >
                            Checkout
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
    </>
  );
};

export default Cart;

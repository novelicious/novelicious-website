import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export interface CartItemProps {
  id: number;
  title: string;
  authors: string;
  image: string;
  genres: string;
  amount: number;
}

export interface CartProps {
  books: CartItemProps[];
  amount: number;
  created_at: string;
}

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartProps>();
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    let isMounted = true; // Variable to track component mount status

    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/cart")
      .then((res) => {
        if (isMounted) {
          const cartData = res.data;
          console.log(res);
          console.log(res.data);
          setCart(cartData);
          setCartItems(cartData.books);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/market");
      });

    return () => {
      isMounted = false;
    };
  }, [navigate, userId]);

  const checkoutHandler = () => {
    axios
      .post("http://127.0.0.1:8000/carts/buy", null, {
        params: { user_id: userId },
      })
      .then(() => {
        // Navigate to the market page with a toast message parameter
        navigate("/market?toast=checkout_success");
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

  const subtotal = cart?.amount;
  const total = subtotal;

  return (
    <>
      <section>
        <div>
          <Toaster />
        </div>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 min-h-[100vh]">
          <header className="sticky top-0 bg-neutral z-50">
            <Navbar />
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="mx-auto max-w-3xl">
                <header className="text-center">
                  <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Your Cart
                  </h1>
                </header>
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
                        />
                      ))}
                    </ul>

                    <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                      <div className="w-screen max-w-lg space-y-4">
                        <dl className="space-y-0.5 text-sm text-gray-700">
                          <div className="flex justify-between">
                            <dt>Subtotal</dt>
                            <dd>IDR{subtotal}</dd>
                          </div>
                          <div className="flex justify-between !text-base font-medium">
                            <dt>Total</dt>
                            <dd>IDR{total}</dd>
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

import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TailSpin } from "react-loader-spinner";

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

interface UserProfileProps {
  id: number;
  username: string;
  gender: string;
  birth_year: number;
  address?: string;
}

const Cart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const [cost, setCost] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfileProps | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      getCartItems();
      getUserProfile();
    }
  }, [navigate, userId]);

  useEffect(() => {
    updateCost();
  }, [cartItems]);

  const getUserProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUserProfile(response.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user profile.", error);
      navigate("/login");
    }
  };

  const updateCost = () => {
    let c = 0;
    cartItems.forEach((item) => {
      c += item.cost * item.amount;
    });
    setCost(c);
  };

  const getCartItems = () => {
    axios
      .get(`http://127.0.0.1:8000/users/${userId}/cart`)
      .then((res) => {
        const cartData = res.data;
        setCartItems(cartData.books);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/market");
      });
  };

  const checkoutHandler = () => {
    axios
      .post("http://127.0.0.1:8000/carts/buy", null, {
        params: { user_id: userId },
      })
      .then((res) => {
        const checkout_id = res.data.id;
        navigate(`/checkout/${checkout_id}`);
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TailSpin height={80} width={80} color="black" />
      </div>
    );
  }

  const canCheckout = userProfile && userProfile.address;

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
                        cost={item.cost}
                        userId={userId ?? ""}
                        onRemoveItem={deleteHandler}
                        onUpdateItem={updateHandler}
                      />
                    ))}
                  </ul>

                  <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                    <div className="w-screen max-w-lg space-y-4">
                      <dl className="space-y-0.5 text-md text-gray-700">
                        <div className="flex justify-between !text-base font-medium">
                          <dt>Total</dt>
                          <dd>IDR {cost.toLocaleString("id-ID")}</dd>
                        </div>
                      </dl>
                      <div className="flex justify-end">
                        <button
                          onClick={checkoutHandler}
                          className={`ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm ${
                            !canCheckout ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={!canCheckout}
                        >
                          Checkout
                        </button>
                      </div>
                      {!canCheckout && (
                        <Link
                          to="/profile"
                          className="text-primary mt-4 underline"
                        >
                          Please update your profile with a valid address to
                          proceed to checkout.
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
      </section>
    </>
  );
};

export default Cart;

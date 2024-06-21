import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  
  const [cart, setCart] = useState<CartProps>();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id");
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/" + userId + "/cart")
      .then((res) => {
        const cartData = res.data;
        console.log(res);
        console.log(res.data);
        setCart(cartData);
        setCartItems(cartData.books);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/market");
      });
  }, []);
  const checkoutHandler = ()=>{
    axios.post("http://127.0.0.1:8000/carts/buy", null, {params: {"user_id":userId}})
    .catch((err)=>{
      console.log(err);
    });
    
    navigate("/market");
  };
  const deleteHandler = (id: number)=>{
    setCartItems(cartItems.filter(item => item.id !== id));
    axios.post("http://127.0.0.1:8000/carts/remove", null, {
      params: {
        "user_id":userId,
        "book_id":id
      }
    }).catch((err)=>{
      console.log(err);
    })
  }
  

  if (loading) {
    return <p>Loading...</p>;
  }

  const subtotal = 200; //cartItems.reduce((acc, item) => acc + item.amount * 200, 0); // Replace 200 with actual item cost
  const total = subtotal;

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

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
                  userId={userId??""}
                  onRemoveItem={()=>deleteHandler(item.id)}
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
                  className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

import React, { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import CheckoutItem, { CheckoutProps } from "../components/CheckoutItem";
import axios from "axios";
const Transactions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [checkouts, setCheckouts] = useState<CheckoutProps[]>([]);
  // const [cart, setCart] = useState<CartProps>();
  // const [products, setproducts] = useState<CartItemProps[]>([]);
  const uid = sessionStorage.getItem("user_id");
  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/users/"+uid+"/checkouts").then((res)=>{
        setCheckouts(res.data);
    });
    

  }, []);

  useEffect(() => setLoading(false));

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
                      {checkouts.map((checkout) => (
                        <CheckoutItem
                            key={checkout.id}
                            id={checkout.id}
                            total_cost={checkout.total_cost} 
                            shipping_fee={checkout.shipping_fee} 
                            status={checkout.status} 
                            created_at={checkout.created_at}                          
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
    </>
  );
};

export default Transactions;

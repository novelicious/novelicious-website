import React, { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiHouseLine } from "react-icons/pi";
import { CiPhone } from "react-icons/ci";
interface ProductProps{
  id: number,
  name: string,
  image: string,
  authors : string,
  cost: number,
}
const Checkout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const id = useLocation().state.id;
  // const [cart, setCart] = useState<CartProps>();
  // const [products, setproducts] = useState<CartItemProps[]>([]);
  useEffect(()=>{


  }, [])

  useEffect(() => setLoading(false));

  const shippingCost = 9000;
  const totalCost =
    products.reduce((acc, product) => acc + product.cost, 0) + shippingCost;

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
            <h1 className="ml-5 text-md font-semibold">Checkout</h1>
          </div>
          {id}
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
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Sent to:</h3>
                    <div className="flex items-center">
                      <CiUser />
                      <p className="mx-2">Andra</p>
                    </div>
                    <div className="flex items-center">
                      <PiHouseLine />
                      <p className="mx-2">Jl.Tanjung Duren Selatan</p>
                    </div>
                    <div className="flex items-center">
                      <CiPhone />
                      <p className="mx-2">+62xxx</p>
                    </div>
                  </div>
                  <hr />
                  <ul className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-4 border-b"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-gray-600">{product.authors}</p>
                          <p className="text-gray-800 font-semibold">
                            Rp.{product.cost}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Shipping</h3>
                      <select className="w-full p-2 border rounded">
                        <option>GOJEK (Rp.9000)</option>
                        <option>Grab (Rp.9000)</option>
                      </select>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Payment Method
                      </h3>
                      <select className="w-full p-2 border rounded">
                        <option>PayPal</option>
                        <option>BCA</option>
                      </select>
                    </div>
                  </ul>

                  <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                    <div className="w-screen max-w-lg space-y-4">
                      <dl className="space-y-0.5 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <dt>Subtotal</dt>
                          <dd>IDR{totalCost}</dd>
                        </div>
                        <div className="flex justify-between !text-base font-medium">
                          <dt>Total</dt>
                          <dd>IDR{totalCost}</dd>
                        </div>
                      </dl>
                      <div className="flex justify-end">
                        <button className="ml-4 inline-flex text-neutral bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-900 rounded text-sm">
                          Next (Transactions)
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
  );
};

export default Checkout;

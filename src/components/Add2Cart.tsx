import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Add2CartButton: React.FC<{id: number}> = ({ id }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartAmount, setCartAmount] = useState<number>(0);
  const userId = localStorage.getItem("user_id");

  const addToCartHandler = (bookId: number, quantity: number) => {
    toast.success("Sucessfully added to cart!", {
      icon: <AiOutlineShoppingCart />,
    });

    axios.post("http://127.0.0.1:8000/carts/add", null, {
      params: {
        book_id: bookId,
        user_id: userId,
        amount: quantity,
      },
    });
    setTimeout(() => {
      setCartAmount(cartAmount + quantity);
    }, 300);
  };

  var size = clicked ? "w-full" : "w-0";
  return (
    <div className="flex mx-2">
      <button
        onClick={() => {
          setClicked(!clicked);
        }}
        className={"text-primary p-2 font-medium hover:scale-105 " + (clicked? "w-full " : "w-fit ")}
      >
        {clicked ? "X" : (
          <div className={"flex justify-start items-center " + (clicked ? "my-0 w-0" : " w-fit")}>
            <FaCartShopping />
            <p className={"font-semibold transition-all duration:3000 ease-in-out " + (clicked ? "text-[0px] " : " mx-3 text-md ")}>
              Add to Cart
            </p>
          </div>
        )}
      </button>
      <div
        className={size + " h-full transition-all duration:500 ease-in-out"}
      >
        <input
          type="number"
          min="1"
          id={`qty-${id}`}
          defaultValue={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value));
          }}
          className="w-full h-fit items-center justify-center rounded block border-gray-200 bg-gray-50 p-2 text-center text-large text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          style={{visibility: clicked ? 'visible': 'hidden'}}
        />
      </div>
      <button
        onClick={() => {
          setClicked(false);
          addToCartHandler(id, quantity);
        }}
        className={
          size +
          " text-neutral block rounded bg-primary" +
          (clicked ? " p-2 " : " p-0 ") +
          "text-sm font-medium transition-all duration:500 ease-in-out hover:scale-105 active:scale-95"
        }
      >
        {clicked && "OK" }
      </button>
    </div>
  );
};

export default Add2CartButton;
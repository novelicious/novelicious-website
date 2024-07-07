import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
interface CartItemProps {
  id: number;
  title: string;
  authors: string;
  image: string;
  genres: string;
  amount: number;
  userId?: string;
  onRemoveItem?: (id: number) => void;
  onUpdateItem? : ()=>void;
}
const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  authors,
  image,
  genres,
  amount,
  userId,
  onRemoveItem,
  onUpdateItem
}) => {
  const changeItemHandler = (amount: number) => {
    if (userId == null || userId == "") return;
    axios
      .post("http://127.0.0.1:8000/carts/update", null, {
        params: {
          user_id: parseInt(userId),
          book_id: id,
          amount: amount,
        },
      }).then(()=>{
        
        if (onUpdateItem != null) onUpdateItem();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const removeHandler = () => {
    if (onRemoveItem != null) onRemoveItem(id);
  };

  return (
    <li className="flex items-center gap-4">
      <Link
        to={`/novel/${id}`}
        className="flex items-center gap-4 w-full h-full origin-left transition-all duration:500 ease-in-out hover:scale-105 active:scale-95"
      >
        <img src={image} alt={title} className="size-16 rounded object-cover" />
        <div>
          <h3 className="text-sm text-gray-900">{title}</h3>
          <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
            <div>
              <dt className="inline">Genre:</dt>
              <dd className="inline">{genres}</dd>
            </div>
            <div>
              <dt className="inline">Authors:</dt>
              <dd className="inline">{authors}</dd>
            </div>
          </dl>
        </div>
      </Link>
      <div className="flex flex-1 items-center justify-end gap-2">
        <form>
          <label htmlFor={`qty-${id}`} className="sr-only">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            id={`qty-${id}`}
            defaultValue={amount}
            onChange={(e) => changeItemHandler(parseInt(e.target.value))}
            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />
        </form>
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
};

export default CartItem;

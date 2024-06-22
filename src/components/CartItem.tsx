import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

interface CartItemProps {
    id: number;
    title: string;
    authors: string;
    image: string;
    genres: string;
    amount: number;
    userId? : string;
    onRemoveItem?: (id: number) => void;
}
const CartItem: React.FC<CartItemProps> = ({ id, title, authors, image, genres, amount, userId, onRemoveItem }) => {
    const changeItemHandler = (amount:number)=>{
        if(userId == null || userId == "") return;
        axios.post("http://127.0.0.1:8000/carts/update", null, {
          params: {
            "user_id":parseInt(userId),
            "book_id":id,
            "amount":amount
          }
        }).catch((err)=>{
          console.log(err);
        })
        
    }
    const removeHandler = () => {
        if(onRemoveItem != null) onRemoveItem(id); 
      };
    

  return (
    

    <li className="flex items-center gap-4">
        <Link
        to={`/novel/${id}`}
        className='flex items-center gap-4 w-full h-full origin-left transition-all duration:500 ease-in-out hover:scale-105 active:scale-95'
        >
        <img
          src={image}
          alt={title}
          className="size-16 rounded object-cover"
        />
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
        <button className="text-gray-600 transition hover:text-red-600" onClick={removeHandler}>
          <span className="sr-only">Remove item</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default CartItem;
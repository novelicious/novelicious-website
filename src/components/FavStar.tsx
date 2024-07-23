import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";

export interface StarProps {
  toggled: boolean;
  bookId: number;
  isShowText: boolean;
  onToggled?: (bookId: number) => void;
  onUntoggled?: (bookId: number) => void;
}

export const onStarToggledHandler = (bookId: number) => {
  toast.success("Sucessfully added to favorites!", {
    icon: <FaStar />,
  });
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    console.log("User is not logged in.");
    return;
  }
  axios
    .post(`http://127.0.0.1:8000/users/${userId}/setfav`, null, {
      params: {
        book_id: bookId,
      },
    })
    .catch((err) => console.log(err));
};

export const onUntoggledHandler = (bookId: number) => {
  const userId = localStorage.getItem("user_id");
  toast.error("Removed from favorites!", {
    icon: <FaTrash />,
  });
  if (!userId) {
    console.log("User is not logged in.");
    return;
  }
  axios
    .post("http://127.0.0.1:8000/users/" + userId + "/removefav", null, {
      params: {
        book_id: bookId,
      },
    })
    // .then(() => {
    //   window.location.reload();
    // })
    .catch((err) => console.log(err));
};

const Star: React.FC<StarProps> = ({
  toggled,
  bookId,
  isShowText: text,
  onToggled,
  onUntoggled,
}) => {
  const [isToggled, setToggled] = useState<boolean>(toggled);

  useEffect(() => {
    setToggled(toggled);
  }, [toggled]);

  return (
    <div className="font-medium ml-2">
      {isToggled ? (
        <button
          onClick={() => {
            if (onUntoggled) onUntoggled(bookId);
            setToggled(false);
          }}
          className="text-xl flex justify-between items-center"
        >
          <FaStar />
          {text ? (
            <p className="text-sm ml-2">Remove from Favorites</p>
          ) : (<></>)}
        </button>
      ) : (
        <button
          onClick={() => {
            if (onToggled) onToggled(bookId);
            setToggled(true);
          }}
          className="text-xl flex justify-between items-center"
        >
          <FaRegStar />
          {text ? (
            <p className="text-sm ml-2">Add to Favorites</p>
          ) : (<></>)}
        </button>
      )}
    </div>
  );
};

export default Star;
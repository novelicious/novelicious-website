import { useNavigate } from "react-router-dom";

export interface CheckoutProps {
  id: number;
  total_cost: number;
  shipping_fee: number;
  status: string;
  created_at: string;
}
const CheckoutItem: React.FC<CheckoutProps> = ({
  id,
  total_cost,
  shipping_fee,
  status,
  created_at,
}) => {
    
  const navigate = useNavigate();
  return (
    <li className="flex items-center gap-4">
      <div
        onClick={(event) => {
          if (status != "pending") {
            event.preventDefault();
          }else{
            navigate("/checkout", {state :{ id : id}, replace:true})
          };
        }}
        className="flex items-center gap-4 w-full h-full origin-left transition-all duration:500 ease-in-out hover:scale-105 active:scale-95"
      >
        <div>
          <h3 className="text-sm text-gray-900">{"Transaction #" + id}</h3>
          <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
            <div>
              <dt className="inline">Cost:</dt>
              <dd className="inline">{"Rp" + total_cost}</dd>
              <dd className="inline text-red-900">
                {shipping_fee == null ? "" : "+" + shipping_fee}
              </dd>
            </div>
            <div>
              <dt className="inline">Status:</dt>
              <dd className="inline">{status}</dd>
            </div>
            <div>
              <dd className="inline">{created_at}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
};

export default CheckoutItem;

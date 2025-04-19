import Skeleton from "../Skeleton";

const OrderSkeleton = () => {
    return (
      <div className="border rounded p-4 space-y-2">
        <div className="w-32 h-4">
          <Skeleton className="w-48 h-4" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="w-36 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        ))}
      </div>
    );
  };
  
  export default OrderSkeleton;
  
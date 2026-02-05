import { Skeleton } from "../components/ui/skeleton";

const ProductGridSkeleton = ({ count = 20 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-3 xl:grid-cols-5 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full md:h-[400px] p-1"
        >
          <div className="relative  flex items-center justify-center">
            <Skeleton className="w-full h-[200px] md:h-[320px] rounded-[5px]" />
          </div>

          {/* optional spacing to match layout */}
          <div className="p-2">
            <Skeleton className="h-3 w-[80%] mb-2" />
            <Skeleton className="h-3 w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;

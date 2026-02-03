import { Skeleton } from "../components/ui/skeleton"

const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-screen mx-auto md:pt-2 md:p-8">
      <div className="md:max-w-[80%] w-full mx-auto flex flex-col md:flex-row">

        {/* LEFT IMAGE SECTION */}
        <div className="flex flex-col-reverse md:flex-row md:w-[40%] w-full mt-5 md:mt-0 gap-2">

          {/* THUMBNAILS */}
          <div className="flex flex-row md:flex-col gap-2 pl-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-lg"
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <Skeleton className="w-full md:h-[500px] h-[500px] rounded-lg" />
        </div>

        {/* RIGHT DETAILS SECTION */}
        <div className="w-full md:w-[50%] md:ml-5 px-4 mt-4 md:mt-0 space-y-3">

          {/* NAME */}
          <Skeleton className="h-6 w-[70%]" />

          {/* ORIGINAL PRICE */}
          <Skeleton className="h-4 w-[40%]" />

          {/* PRICE */}
          <Skeleton className="h-6 w-[30%]" />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>

          {/* COLORS */}
          <div>
            <Skeleton className="h-4 w-[20%] mb-2" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-[30px] h-[30px] rounded-full"
                />
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <Skeleton className="h-4 w-[20%] mb-2" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-[40px] h-[28px]" />
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <Skeleton className="h-4 w-[30%] mb-2" />
            <div className="flex gap-3 items-center">
              <Skeleton className="w-[25px] h-[25px]" />
              <Skeleton className="w-[20px] h-[20px]" />
              <Skeleton className="w-[25px] h-[25px]" />
            </div>
          </div>

          {/* ADD TO CART BUTTON */}
          <Skeleton className="w-[90%] h-[40px] mx-auto mt-4" />

          {/* CHARACTERISTICS */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-[40%]" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetailsSkeleton

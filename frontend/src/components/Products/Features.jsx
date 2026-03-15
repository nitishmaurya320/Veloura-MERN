import React from "react";

const Features = () => {
  return (
    <section className="w-full ">
      <div className="w-[90%] flex flex-col-reverse md:flex-row  mx-auto rounded-lg">
        <div className="w-full p-5 md:w-1/2 flex justify-between items-center bg-green-100">
          <div className="w-full">
            <p className="font-semibold">Comfort and Style</p>
            <h1 className="text-2xl md:text-4xl font-bold mt-2">
              Allen solly made for your everyday life
            </h1>
            <p className="mt-3">
              Discover high-quality, comfortable clothing that effortlessly
              blends fashion and function. Desianed to make you look and feel
              great every day.
            </p>
            <button className="bg-black text-white px-3 py-2 mt-3    rounded-md">
              Shop Now
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            className="w-full rounded-r-3xl"
            src="https://www.adgully.com/img/400/201903/allen-solly_future-of-bottomwear_campaign-image.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;

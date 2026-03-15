import React from "react";
import heroiamge from "../../assets/girl.png";

const Hero = () => {
  return (
    <div>
      <section className="w-full mt-10 md:mt-20 bg-gradient-to-r from-purple-100 via-pink-50 to-purple-50 py-20 h-full md:h-[550px]">
        <div className="max-w-7xl mx-auto  px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="max-w-xl mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Elevate Your Style with Veloura
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Discover the latest trends in fashion designed to make you stand
              out.
            </p>
            <div className="mt-6">
              <a
                href="/collections/all"
                className="inline-block z-1 bg-[#9B2A90] hover:bg-pink-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition duration-300"
              >
                Start Shopping
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/3">
            <img
              src={heroiamge}
              alt="Shopping"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

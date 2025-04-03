import React from "react";

const Reviews = () => {
    return (
        <div className="text-center bg-white/65 items-center justify-center mx-4 sm:mx-8 md:mx-20 lg:mx-30 my-4 sm:my-6 md:my-10 rounded-2xl sm:rounded-3xl md:rounded-4xl py-6 sm:py-8 md:py-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-serif mb-4 sm:mb-6 md:mb-8">
                User Reviews
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-evenly gap-4 sm:gap-8 md:gap-16 px-4 sm:px-6 md:pl-10 md:pr-10">
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200 w-full sm:w-1/2 md:w-auto">
                    <img
                        src="https://images.unsplash.com/photo-1504203772830-87fba72385ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym95fGVufDB8MXwwfHx8MA%3D%3D"
                        alt="User 1"
                        className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto rounded-full"
                    />
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        John Doe
                    </h3>
                    <p className="text-sm sm:text-base">
                        "This platform has significantly improved my productivity and goal tracking."
                    </p>
                </div>
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200 w-full sm:w-1/2 md:w-auto">
                    <img
                        src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8MXwwfHx8MA%3D%3D"
                        alt="User 2"
                        className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto rounded-full"
                    />
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        Jane Smith
                    </h3>
                    <p className="text-sm sm:text-base">
                        "The AI insights are incredibly helpful in optimizing my strategies."
                    </p>
                </div>
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200 w-full sm:w-1/2 md:w-auto">
                    <img
                        src="https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2lybHxlbnwwfDF8MHx8fDA%3D"
                        alt="User 3"
                        className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 mx-auto rounded-full"
                    />
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        Emily Johnson
                    </h3>
                    <p className="text-sm sm:text-base">
                        "I love the gamification aspect, it makes achieving goals fun and engaging."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
import React from "react";
const Services = () => {
    const services = [
        {
            icon: "fa-solid fa-chart-simple",
            title: "Goal Tracking",
            description: "Set and track your personal and professional goals with precision."
        },
        {
            icon: "fa-solid fa-brain",
            title: "AI Insights",
            description: "Leverage AI to gain actionable insights and optimize your strategies."
        },
        {
            icon: "fa-solid fa-trophy",
            title: "Gamification",
            description: "Engage with interactive challenges that make goal achievement fun."
        }
    ];

    return (
        <section className="py-8 sm:py-12 lg:py-16 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                    Our Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group p-6 sm:p-8 lg:p-10 rounded-xl bg-gray-800 hover:bg-gray-700 border  border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        >
                            <i className={`${service.icon} text-xl sm:text-2xl lg:text-3xl mb-4 text-blue-400 group-hover:text-blue-500`}></i>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-semibold mb-3">
                                {service.title}
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-gray-300  group-hover:text-gray-100">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

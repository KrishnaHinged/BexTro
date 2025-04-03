import React from "react";

const Services = ({ isDarkMode }) => {
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
        <section 
            className={`py-8 sm:py-12 lg:py-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                    Our Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`group p-6 sm:p-8 lg:p-10 rounded-xl ${
                                isDarkMode 
                                    ? 'bg-gray-800 hover:bg-gray-700' 
                                    : 'bg-white/50 hover:bg-white'
                            } border ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            } hover:border-${
                                isDarkMode ? 'white' : 'gray-300'
                            } shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
                        >
                            <i className={`${service.icon} text-xl sm:text-2xl lg:text-3xl mb-4 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            } group-hover:text-blue-500`}></i>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-semibold mb-3">
                                {service.title}
                            </h3>
                            <p className={`text-sm sm:text-base leading-relaxed ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            } group-hover:${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
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
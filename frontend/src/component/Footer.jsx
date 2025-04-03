import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
                {/* Company Info */}
                <div className="w-1/3 space-y-4 text-center md:text-left">
                    <h3 className="text-lg font-semibold">BeXtro</h3>
                    <p className="text-sm text-gray-400">© 2025 BeXtro. All rights reserved.</p>
                    <p className="text-sm text-gray-400">Building innovative solutions for a better tomorrow.</p>
                </div>

                {/* Contact Info */}
                <div className="w-1/3 space-y-4 text-center md:text-left">
                    <h3 className="text-lg font-semibold">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Phone: +1 234 567 890</li>
                        <li>Email: support@bextro.com</li>
                        <li>Address: 123 Tech Street, Innovation City</li>
                    </ul>
                </div>
            </div>

            {/* Social Media and Bottom Bar */}
            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <span className="sr-only">Twitter</span>
                        {/* Twitter Icon - You can replace with actual icon */}
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                </div>
                <p className="text-xs text-gray-500">Designed with ♥ by BeXtro Team</p>
            </div>
        </footer>
    );
};

export default Footer;

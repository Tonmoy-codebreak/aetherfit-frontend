import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-900 text-zinc-300 py-12 px-4 sm:px-6 lg:px-8 font-sans border-t border-zinc-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                {/* Company Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                    <div className="flex items-center">
                        <img
                            src="https://i.ibb.co/QFNxgTVF/aetherfit-logo.png"
                            alt="AetherFit Logo"
                            className="h-10 w-auto mr-3"
                        />
                        <span className="text-3xl font-bold text-[#faba22] font-funnel">AetherFit</span>
                    </div>
                    <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                        Your journey to a healthier, stronger you starts here. Empowering fitness, one step at a time.
                    </p>
                    <p className="text-zinc-400 text-xs">
                        &copy; {currentYear} AetherFit. All rights reserved.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white font-funnel">Quick Links</h3>
                    <ul className="space-y-2">
                        {['Home', 'Classes', 'Trainers', 'Community Forum'].map(link => (
                            <li key={link}>
                                <a
                                    href="#"
                                    className="hover:text-[#faba22] transition-colors text-base"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white font-funnel">Contact Us</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <FaEnvelope className="w-5 h-5 mr-3 text-[#faba22]" />
                            <a
                                href="mailto:aetherfitmail@gmail.com"
                                className="hover:text-[#faba22] transition-colors text-base"
                            >
                                aetherfitmail@gmail.com
                            </a>
                        </li>
                        <li className="flex items-center">
                            <FaMapMarkerAlt className="w-5 h-5 mr-3 text-[#faba22]" />
                            <span className="text-base">Dhaka, Bangladesh</span>
                        </li>
                    </ul>
                </div>

                {/* Social Media Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-white font-funnel">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#faba22] transition-transform transform hover:scale-110"
                            aria-label="Facebook"
                        >
                            <FaFacebookF size={22} />
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#faba22] transition-transform transform hover:scale-110"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={22} />
                        </a>
                        <a
                            href="https://x.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#faba22] transition-transform transform hover:scale-110"
                            aria-label="Twitter"
                        >
                            <FaTwitter size={22} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;

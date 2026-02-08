import React from 'react';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-white text-xl font-bold mb-4 font-serif">
                            <Sprout className="w-6 h-6 text-green-500" />
                            <span>AgriConnect</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Empowering farmers with technology for a sustainable and efficient future.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-green-400 transition-colors">Home</a></li>
                            <li><a href="/about" className="hover:text-green-400 transition-colors">About Us</a></li>
                            <li><a href="/request" className="hover:text-green-400 transition-colors">Services</a></li>
                            <li><a href="/status" className="hover:text-green-400 transition-colors">Track Status</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-green-500" />
                                <span>bishalpaul151@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span>+91 7857991455</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-500" />
                                <span>123 Farm Lane, Green Valley</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for latest updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-green-500"
                            />
                            <button className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

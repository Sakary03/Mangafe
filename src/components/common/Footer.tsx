import React from 'react';
import {
  GithubOutlined,
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from '@ant-design/icons';

const Footer: React.FC = () => {
  return (
    <footer
      className="py-8 md:py-10 lg:py-12 relative"
      style={{ backgroundColor: '#215dd6' }}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: '300px 300px',
          }}
        ></div>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <a
              href="#"
              className="flex items-center mb-4 text-2xl font-bold text-white"
            >
              <svg
                className="mr-2 h-8"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Your SVG paths here */}
              </svg>
              Mangaka
            </a>
            <p className="text-blue-100">
              Discover the world of manga with our curated collection of the
              best titles from around the globe.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-white hover:text-blue-200 transform hover:scale-110 transition-all duration-300"
              >
                <FacebookOutlined style={{ fontSize: '24px' }} />
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 transform hover:scale-110 transition-all duration-300"
              >
                <TwitterOutlined style={{ fontSize: '24px' }} />
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 transform hover:scale-110 transition-all duration-300"
              >
                <InstagramOutlined style={{ fontSize: '24px' }} />
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 transform hover:scale-110 transition-all duration-300"
              >
                <GithubOutlined style={{ fontSize: '24px' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Popular Manga
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Genres
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Reading Lists
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Authors
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px bg-blue-400 opacity-30 my-8"
          style={{ boxShadow: '0 0 6px rgba(255, 255, 255, 0.3)' }}
        ></div>

        {/* Bottom Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-blue-100">
          <span className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Mangaka. All Rights Reserved.
          </span>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-white hover:underline transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-white hover:underline transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-white hover:underline transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

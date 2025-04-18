import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
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

        <p className="my-4 text-gray-500 dark:text-gray-400">A manga website</p>

        <ul className="flex flex-wrap justify-center items-center mb-6 text-sm font-medium text-gray-900 dark:text-white">
          {[
            'About',
            'Premium',
            'Campaigns',
            'Blog',
            'Affiliate Program',
            'FAQs',
            'Contact',
          ].map(item => (
            <li key={item}>
              <a href="#" className="mx-2 hover:underline">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          © 2025{' '}
          <a href="#" className="hover:underline">
            Mangaka
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

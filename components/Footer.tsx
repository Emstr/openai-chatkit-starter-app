import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 pt-12 pb-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link
              href="https://www.gomarloo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <Image
                src="/Marloo-logo.svg"
                alt="Marloo"
                width={160}
                height={43}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-500">
              AI for Financial Advisers
            </p>
            <Link
              href="https://www.gomarloo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Marloo
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
          <Link
            href="https://www.gomarloo.com/bookings/au?utm_source=askmarloo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Book a demo of Marloo
          </Link>
              </li>
              <li>
          <Link
            href="https://www.gomarloo.com/case-studies?utm_campaign=askmarloo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Read Marloo case studies
          </Link>
              </li>
            </ul>
        </div>

          {/* Mobile App Downloads */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Download App
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://gomarloo.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <Image
                  src="/android.png"
                  alt="Download on Android"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
        <Link
                href="https://gomarloo.com/download"
          target="_blank"
          rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <Image
                  src="/iphone.svg"
                  alt="Download on iPhone"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
        </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Marloo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


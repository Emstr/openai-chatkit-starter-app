import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto" style={{ minHeight: '500px' }}>
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <Link
          href="https://www.gomarloo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
            Marloo
          </span>
          {" "}– AI for Financial Advisers
        </Link>
      </div>
    </footer>
  );
}


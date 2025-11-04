export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto" style={{ minHeight: '500px' }}>
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Powered by <span className="font-semibold text-gray-900 dark:text-gray-100">Marloo</span>
        </p>
      </div>
    </footer>
  );
}


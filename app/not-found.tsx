import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/b-gradient.png)',
        }}
      />
      
      <div className="text-center max-w-2xl mx-auto relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-white">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Page not found
        </h2>
        <p className="text-lg md:text-xl text-white mb-8 opacity-90">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Link
            href="/"
            className="rounded-xl bg-white border-2 border-gray-200 px-6 py-3 text-base font-medium text-gray-900 transition-all hover:border-gray-300 hover:shadow-md"
          >
            Go Home
          </Link>
          <Link
            href="/speakers"
            className="rounded-xl bg-white border-2 border-gray-200 px-6 py-3 text-base font-medium text-gray-900 transition-all hover:border-gray-300 hover:shadow-md"
          >
            View Speakers
          </Link>
          <Link
            href="/talks"
            className="rounded-xl bg-white border-2 border-gray-200 px-6 py-3 text-base font-medium text-gray-900 transition-all hover:border-gray-300 hover:shadow-md"
          >
            View Talks
          </Link>
          <Link
            href="/agenda"
            className="rounded-xl bg-white border-2 border-gray-200 px-6 py-3 text-base font-medium text-gray-900 transition-all hover:border-gray-300 hover:shadow-md"
          >
            View Agenda
          </Link>
        </div>

        <p className="text-sm text-white opacity-75">
          Or try asking Marloo anything about FAAA
        </p>
      </div>
    </main>
  );
}


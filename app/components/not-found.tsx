import { Link } from "@remix-run/react";

export default function NotFound() {
    return (
        <div className="container max-w-4xl pb-6 flex flex-col pt-16">
            <p className="text-sm font-medium text-green-400">404 error</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Page not found</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for doesn't exist.</p>

            <div className="flex items-center mt-6 gap-x-3">
                <a href="/" className="w-1/2 px-5 py-2 text-sm tracking-wide  transition-colors duration-200 bg-green-950 text-green-400 rounded-lg shrink-0 w-auto hover:bg-green-600 hover:text-white">
                    Take me home
                </a>
            </div>

            <div className="mt-10 space-y-6">
                <div>
                    <a href="/blogs" className="inline-flex items-center text-sm text-green-400 gap-x-2 hover:underline">
                        <span>My blog</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Read the latest posts on our blog.</p>
                </div>

                <div>
                    <a href="/projects" className="inline-flex items-center text-sm text-green-400 gap-x-2 hover:underline">
                        <span>My Projects</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Dive in to learn all about my projects.</p>
                </div>
            </div>
        </div>
    )
}

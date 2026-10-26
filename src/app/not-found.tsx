import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link'

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "404 - Page Not Found",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
};

export default function NotFound() {
    return (
        <div className="grid place-content-center h-screen pb-6 pt-16">
            <p className="text-sm font-medium text-primary">404 error</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl ">Page not found 😭</h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for doesn&#39;t exist.</p>

            <Link href="/" className="border border-white/20 bg-[#393939]/40 px-2 py-1 mt-5 rounded-lg w-fit font-bebas-neue text-white text-sm sm:text-base tracking-wide">
                Take me home
            </Link>
        </div>
    )
}
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-500 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center space-y-8 px-4 sm:px-0">
        {/* Logo and Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="text-indigo-600"
          />
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Unlock Your Potential with{' '}
            <span className="text-indigo-600">AI-Powered Learning 🚀</span>
          </h1>
        </div>
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-200">
          Experience personalized learning paths that adapt in real-time—empower your growth anytime, anywhere.
        </p>
        {/* Call to Action */}
        <div>
          <Link href="/workspace">
            <Button className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </div>
        {/* Footer credit (moved up) */}
        <div className="mt-6">
          <span className="text-black font-bold">Made by Akhil Mekala 😉</span>
        </div>
      </div>
    </div>
  );
}
// src/components/Layout.js

import Link from 'next/link'
import Image from 'next/image'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-semibold ml-2">Secure Auth</span>
            </div>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-700 hover:text-blue-500">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-700 hover:text-blue-500">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 text-center text-gray-700">
          © {new Date().getFullYear()} Secure Auth. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout

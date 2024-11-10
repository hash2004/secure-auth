// src/pages/index.js

import Link from 'next/link'

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Secure Auth</h1>
      <p className="text-lg mb-6">A secure authentication system with OTP verification.</p>
      <div className="space-x-4">
        <Link href="/signup" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Sign Up
        </Link>
        <Link href="/login" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
          Login
        </Link>
      </div>
    </div>
  )
}

export default Home

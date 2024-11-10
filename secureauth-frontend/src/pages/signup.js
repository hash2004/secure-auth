// src/pages/signup.js

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signUp } from '../utils/api'

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [serverError, setServerError] = useState('')
  const router = useRouter()

  const onSubmit = async (data) => {
    try {
      await signUp(data)
      router.push({
        pathname: '/verify-otp',
        query: { username: data.username },
      })
    } catch (error) {
      setServerError(error.response?.data?.detail || 'An error occurred.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="w-full px-3 py-2 border rounded"
            type="text"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Password</label>
          <input
            {...register('password', { required: 'Password is required' })}
            className="w-full px-3 py-2 border rounded"
            type="password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-3 py-2 border rounded"
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border rounded"
            type="text"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500">
          Login here
        </Link>
      </p>
    </div>
  )
}

export default Signup

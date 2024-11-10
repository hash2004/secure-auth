// src/pages/login.js

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { login } from '../utils/api'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [serverError, setServerError] = useState('')
  const router = useRouter()

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        router.push('/dashboard')
      } else {
        setServerError('Failed to log in. No token received.')
      }
    } catch (error) {
      setServerError(error.response?.data?.detail || 'An error occurred.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
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

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-500">
          Sign up here
        </Link>
      </p>
    </div>
  )
}

export default Login

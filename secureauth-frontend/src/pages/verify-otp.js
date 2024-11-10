// src/pages/verify-otp.js

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { verifyOTP } from '../utils/api'

const VerifyOTP = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const { username } = router.query

  useEffect(() => {
    if (!username) {
      router.replace('/signup')
    }
  }, [username, router])

  const onSubmit = async (data) => {
    try {
      await verifyOTP(data)
      setSuccessMessage('OTP verified successfully. You can now log in.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setServerError(error.response?.data?.detail || 'An error occurred.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>
      {serverError && <p className="text-red-500 mb-4">{serverError}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="w-full px-3 py-2 border rounded"
            type="text"
            defaultValue={username || ''}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700">OTP</label>
          <input
            {...register('otp', { required: 'OTP is required' })}
            className="w-full px-3 py-2 border rounded"
            type="text"
          />
          {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Verify OTP
        </button>
      </form>
    </div>
  )
}

export default VerifyOTP

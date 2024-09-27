import { useNavigate } from 'react-router-dom'
import { zorkin } from '../lib'
import { Spinner } from '../components'
import React from 'react'
import toast from 'react-hot-toast'

const GoogleIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="15.25" viewBox="0 0 488 512" fill="#DB4437"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
)

const Home = (): JSX.Element => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const handleSignin = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const provider = e.currentTarget.id
    if (provider !== 'Google') {
      return
    }
    zorkin.login({ provider }).then(() => {
      setIsLoading(false)
      navigate('/profile')
    }).catch((e) => {
      setIsLoading(false)
      localStorage.clear()
      sessionStorage.clear()
      toast.error("Failed to sign in. Have you joined the beta program?")
    })
  }
  return (
    <main className="h-screen flex flex-col justify-center items-center">
      <div className="mx-auto max-w-[360px] w-full px-4 py-16 lg:px-8 bg-white rounded-lg sm:border">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Zorkin Sign-In</h1>
          <br></br>
          <h2 className="text-xl text-slate-600 sm:text-2xl">Beta v1</h2>
          <p className="mt-4 text-gray-500">Sign into your account.</p>
        </div>
        <div className="mx-auto mt-8 space-y-4 w-full max-w-md">
          <button
            type="submit"
            id="Google"
            className="grid grid-cols-[auto_1fr] items-center w-full rounded-lg bg-slate-200 px-5 py-3 text-md font-medium text-black transition-all hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            onClick={(e) => { void handleSignin(e) }}
          >
            {isLoading ? <Spinner /> : <GoogleIcon />}
            <>
              Sign in with Google
            </>
          </button>
          {/* Aesthetic Note */}
          <br></br>
          <p className="mt-6 text-sm text-center text-slate-600">
            Only users registered for the beta program can access the dashboard.{" "}
            <a
              href="https://forms.gle/cV6EwkYHdk6foX3p7"
              className="text-indigo-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register here
            </a>.
          </p>
        </div>
      </div>
    </main>

  )
}

export default Home

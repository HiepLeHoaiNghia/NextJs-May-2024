import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='relative flex h-screen w-full flex-col bg-white dark:bg-dark-primary'>
      <div className='flex h-full items-center justify-center'>
        <Outlet />
      </div>
      <p className='p-2 text-center text-sm font-medium text-white'>Copyright ©2024 Produced by Motech</p>
    </div>
  )
}

export default AuthLayout

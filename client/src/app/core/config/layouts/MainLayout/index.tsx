import { Outlet } from 'react-router-dom'
import { Header, Sidebar } from 'src/components/'

export default function MainLayout() {
  return (
    <div className='flex h-screen flex-col'>
      <div className='flex'>
        <Sidebar />
        <div className='flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]'>
          <Header />
          <div className='dark:bg-dark-secondary'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

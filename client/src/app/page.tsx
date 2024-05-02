import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  const isAuth = true
  if (!!isAuth) {
    // ? redirect('/login') sẽ chuyển hướng người dùng đến trang login nếu chưa login
    // redirect chạy trong quá  trình render
    // ! redirect k thể sử dụng trong event handler, nếu muốn sử dụng thì phải sử dụng router.push
    redirect('/login')
  }
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sansita font-bold'>
      <ul>
        <li>
          <Link className='font-black text-green-950' href='/login'>
            Login page
          </Link>
        </li>
        <li>
          <Link className='font-black text-green-950' href='/register'>
            Register page
          </Link>
        </li>
      </ul>
      <Image src='/images/city.jpg' alt='city' width={1280} height={200} quality={100} priority title='insideImage' />
      <Image
        src='https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        alt='outsideImage'
        width={1280}
        height={200}
        quality={0}
        priority
        title='outsideImage'
      />
    </main>
  )
}

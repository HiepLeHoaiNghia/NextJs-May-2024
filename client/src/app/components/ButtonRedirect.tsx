'use client'

import { useRouter } from 'next/navigation'

export default function ButtonRedirect() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/login')
  }

  // ? dùng useRouter để tạo ra một đối tượng router, sau đó sử dụng hàm push để chuyển hướng đến trang login
  // ? useRouter phải sử dụng trong client side, không thể sử dụng trong server side
  // ! useRoute k thể open new tab, nếu muốn open new tab thì dùng Link

  return (
    <button
      className='rounded-lg border border-black p-2 hover:bg-black hover:text-white'
      type='button'
      onClick={handleClick}
    >
      To Login page
    </button>
  )
}

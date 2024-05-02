import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-sansita text-9xl font-bold'>
      tiếng Việt
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

import { Button } from '@/components/core/Button/Button';
import FigmaButton from '@/components/core/Button/FigmaButton';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <div className='border border-blue-100 px-lg py-md bg-primary-500'>
          button Test
        </div>

        <Button>new button</Button>
        <FigmaButton>FigmaButton !</FigmaButton>
      </main>
    </div>
  );
}

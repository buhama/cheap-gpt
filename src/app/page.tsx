import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function Home() {
	return (
		<main className='w-screen flex justify-center h-screen items-end'>
			<div className='max-w-xl w-full mb-20'>
				<div className='flex flex-col bg-white dark:bg-zinc-900'>
					<div className='flex flex-col h-full justify-end overflow-y-auto p-4 space-y-4'>
						<div className='flex items-end space-x-4'>
							<div className='w-10 h-10 rounded-full bg-slate-500'></div>
							<div className='flex flex-col'>
								<div className='font-medium'>You</div>
								<div className='mt-1'>Hello, how are you?</div>
							</div>
						</div>
					</div>
					<div className='flex items-center p-4 border-t dark:border-zinc-700'>
						<Input className='flex-grow' placeholder='Type a message' />
						<Button className='ml-2'>Send</Button>
					</div>
				</div>
			</div>
		</main>
	);
}

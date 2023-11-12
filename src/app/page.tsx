import Chat from '@/components/chat';


export default async function Home() {
	return (
		<main className='w-screen flex justify-center h-full items-end'>
			<Chat />
		</main>
	);
}

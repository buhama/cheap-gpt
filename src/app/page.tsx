import Chat from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OpenAIStream } from 'ai';
import Image from 'next/image';
import OpenAI from 'openai';

export default async function Home() {
	return (
		<main className='w-screen flex justify-center h-screen items-end'>
			<Chat />
		</main>
	);
}

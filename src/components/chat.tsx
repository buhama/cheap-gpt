'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface Message {
	type: 'user' | 'bot';
	message: string;
}

const Chat = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentMessage, setCurrentMessage] = useState<string>('');
	const [currentResponse, setCurrentResponse] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setMessages((prev) => [...prev, { type: 'user', message: currentMessage }]);
		setCurrentResponse('');
		const response = await fetch('/api/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				messages,
				currentMessage,
			}),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		// This data is a ReadableStream
		const data = response.body;
		if (!data) {
			throw new Error('No data');
		}

		const reader = data.getReader();
		const decoder = new TextDecoder();
		let done = false;
		// setModalOpen(false);

		let description = '';

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunkValue = decoder.decode(value);
			console.log('chunkValue', chunkValue);
			description += chunkValue;
			setCurrentResponse((prev) => prev + chunkValue);
			setLoading(false);
		}

		setCurrentMessage('');
		setMessages((prev) => [...prev, { type: 'bot', message: description }]);
		setCurrentResponse('');
	};

	return (
		<div className='max-w-4xl w-full mb-20'>
			<div className='flex flex-col bg-white dark:bg-zinc-900'>
				<div className='flex flex-col h-full justify-end overflow-y-auto p-4 space-y-4'>
					{messages.map(({ type, message }, i) => (
						<div className='flex items-end space-x-4' key={i}>
							<div
								className={`w-10 h-10 rounded-full ${
									type === 'bot' ? 'bg-slate-900' : 'bg-slate-500'
								}`}
							></div>
							<div className='flex flex-col w-fit'>
								<div className='font-medium'>
									{type === 'bot' ? 'Bot' : 'You'}
								</div>
								<div className='mt-1'> {message}</div>
							</div>
						</div>
					))}
					{currentResponse && (
						<div className='flex items-end space-x-4'>
							<div className='w-10 h-10 rounded-full bg-slate-900'></div>
							<div className='flex flex-col w-fit'>
								<div className='font-medium'>Bot</div>
								<div className='mt-1'> {currentResponse}</div>
							</div>
						</div>
					)}
					{loading && (
						<>
							<div className='flex items-center space-x-4'>
								<Skeleton className='h-12 w-12 rounded-full' />
								<div className='space-y-2'>
									<Skeleton className='h-4 w-[250px]' />
									<Skeleton className='h-4 w-[200px]' />
								</div>
							</div>
						</>
					)}
				</div>
				<form
					className='flex items-center p-4 border-t dark:border-zinc-700'
					onSubmit={(e) => submit(e)}
				>
					<Input
						value={currentMessage}
						onChange={(e) => setCurrentMessage(e.target.value)}
						name='message'
						className='flex-grow'
						placeholder='Type a message'
					/>
					<Button className='ml-2' type='submit'>
						Send
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Chat;

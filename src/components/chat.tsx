'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getResponse } from '@/lib/completion';
import { Skeleton } from './ui/skeleton';

const Chat = () => {
	const [message, setMessage] = useState('');
	const [response, setResponse] = useState('');
	const [loading, setLoading] = useState(false);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setResponse('');
		setLoading(true);
		const response = await fetch('/api/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message,
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
			setResponse((prev) => `${prev}${chunkValue}`);
		}

		setLoading(false);
		setMessage('');

	};

	return (
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

					{loading && !response && (
						<>
							<div className='flex items-center space-x-4'>
								<div className='space-y-2'>
									<Skeleton className='h-4 w-[250px]' />
									<Skeleton className='h-4 w-[200px]' />
								</div>
								<Skeleton className='h-12 w-12 rounded-full' />
							</div>
						</>
					)}
					{response && (
						<div className='flex items-end space-x-4'>
							<div className='w-10 h-10 rounded-full bg-slate-900'></div>
							<div className='flex flex-col w-96'>
								<div className='font-medium'>ChatGPT</div>
								<div className='mt-1'> {response}</div>
							</div>
						</div>
					)}
				</div>
				<form
					className='flex items-center p-4 border-t dark:border-zinc-700'
					onSubmit={(e) => submit(e)}
				>
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
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

import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// export const runtime = 'edge';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

export const getResponse = async (message: string) => {
	'use server';

	console.log('here');

	// const message = formData.get('message') as string;

	// Request the OpenAI API for the response based on the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		stream: true,
		messages: [
			{
				role: 'user',
				content: message ?? 'Tell me about OSAP or something',
			},
		],
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);

	// const reader = stream.getReader();

	return new StreamingTextResponse(stream);

	// console.log('test', formData.get('message'));
};

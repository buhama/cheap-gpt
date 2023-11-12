import { OpenAIStream, StreamingTextResponse } from 'ai';
import {
	ChatCompletionRequestMessageRoleEnum,
	Configuration,
	OpenAIApi,
} from 'openai-edge';
export const runtime = 'edge';

const apiConfig = new Configuration({
	apiKey: process.env.OPENAI_API_KEY!,
});

interface Message {
	type: 'user' | 'bot';
	message: string;
}

const openai = new OpenAIApi(apiConfig);

export async function POST(req: Request) {
	const reqBody = await req.json();
	console.log('reqbody', reqBody);
	const messages: Message[] = reqBody.messages;
	const currentMessage = reqBody.currentMessage || '';
	// if (organizer && useOrganizer) {
	// 	AIPrompt += `The event is organized by an organization called: ${organizer}\n\n`;
	// }

	const promptMessageObjects = messages.map((message) => {
		if (message.type === 'user') {
			return {
				role: ChatCompletionRequestMessageRoleEnum.User,
				content: message.message,
			};
		} else {
			return {
				role: ChatCompletionRequestMessageRoleEnum.Assistant,
				content: message.message,
			};
		}
	});

	try {
		const response = await openai.createChatCompletion({
			model: 'gpt-4-1106-preview',
			stream: true,
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful chatbot that helps people with all sorts of information. Format your message using markdown.',
				},
				...promptMessageObjects,
				{
					role: 'user',
					content: currentMessage,
				},
			],
		});

		const stream = OpenAIStream(response);

		// Respond with the stream
		return new StreamingTextResponse(stream);
	} catch (error) {
		console.log(error);

		return new Response('Something went wrong', { status: 500 });
	}

	// res.status(200).json({ result: completion.data });
}

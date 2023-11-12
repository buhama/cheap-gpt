import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
export const runtime = 'edge';

const apiConfig = new Configuration({
	apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export async function POST(req: Request) {
	const reqBody = await req.json();
	const message = reqBody.message;

	let AIPrompt = 'You help people. ';
	if (message) {
		AIPrompt = message;
	}

	// if (organizer && useOrganizer) {
	// 	AIPrompt += `The event is organized by an organization called: ${organizer}\n\n`;
	// }

	try {
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo-16k-0613',
			stream: true,
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful chatbot that helps people with all sorts of information',
				},
				{
					role: 'user',
					content: AIPrompt,
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

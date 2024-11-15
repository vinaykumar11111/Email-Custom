import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('Api_key');

export async function generateEmailContent(prompt: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const fullPrompt = `
    Generate a professional email with the following context:
    ${context}
    
    Additional instructions:
    ${prompt}
    
    Format the response as JSON with 'subject' and 'body' fields.
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      subject: 'Generated Email',
      body: text
    };
  }
}
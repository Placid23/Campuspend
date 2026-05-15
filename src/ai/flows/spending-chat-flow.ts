'use server';
/**
 * @fileOverview AI Chatbot flow for financial consulting.
 *
 * - spendingChat - A function that handles user queries about their spending.
 * - SpendingChatInput - The input type containing chat history and context.
 * - SpendingChatOutput - The string response from the AI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
  currentMessage: z.string(),
  spendingContext: z.array(z.object({
    description: z.string(),
    amount: z.number(),
    category: z.string(),
  })).optional(),
});
export type SpendingChatInput = z.infer<typeof SpendingChatInputSchema>;

export async function spendingChat(input: SpendingChatInput): Promise<string> {
  const {text} = await ai.generate({
    system: `You are the CafePay Financial Consultant. You analyze academic spending using Decision Tree Analysis.
    Your goal is to help students understand their financial leakage and improve their essentiality ratio.
    
    Current Student Spending Context:
    ${JSON.stringify(input.spendingContext || [], null, 2)}
    
    Be concise, helpful, and use academic/fintech terminology like 'nodes', 'leakage', and 'essentiality'.`,
    prompt: input.currentMessage,
    history: input.history.map(h => ({
      role: h.role,
      content: [{text: h.content}]
    })),
  });
  return text;
}

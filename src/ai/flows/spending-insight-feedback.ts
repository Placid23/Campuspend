
'use server';
/**
 * @fileOverview A Genkit flow for providing Intelligent Financial Analysis using a Decision Tree model.
 *
 * - spendingInsightFeedback - A function that provides analysis based on purchase-based logging.
 * - SpendingInsightFeedbackInput - The input type for the function.
 * - SpendingInsightFeedbackOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingInsightFeedbackInputSchema = z.object({
  timePeriod: z.string().describe('The time period for analysis.'),
  totalBudget: z.number().describe('The student\'s total budget allocation.'),
  categoryBudgets: z.record(z.string(), z.number()).describe('Allocation mapping.'),
  spendingRecords: z.array(z.object({
    category: z.string(),
    amount: z.number(),
    date: z.string().datetime(),
    vendor: z.string().optional(),
  })).describe('Real-time logs from purchase-based activity.'),
});
export type SpendingInsightFeedbackInput = z.infer<typeof SpendingInsightFeedbackInputSchema>;

const SpendingInsightFeedbackOutputSchema = z.object({
  decisionTreePath: z.string().describe('The logical path taken through the analysis tree.'),
  overallFeedback: z.enum(['Excellent Control', 'Warning', 'Overspending']),
  classification: z.object({
    essentialRatio: z.number().describe('Percentage of essential vs non-essential spending.'),
    leakagePoints: z.array(z.string()).describe('Specific purchase logs identified as financial leakage.'),
  }),
  explanation: z.string(),
  suggestions: z.array(z.string()),
  categoryInsights: z.array(z.object({
    category: z.string(),
    spent: z.number(),
    budget: z.number().optional(),
    status: z.enum(['Under Budget', 'On Budget', 'Slightly Over Budget', 'Significantly Over Budget']),
    comment: z.string(),
  })),
});
export type SpendingInsightFeedbackOutput = z.infer<typeof SpendingInsightFeedbackOutputSchema>;

export async function spendingInsightFeedback(input: SpendingInsightFeedbackInput): Promise<SpendingInsightFeedbackOutput> {
  return spendingInsightFeedbackFlow(input);
}

const spendingInsightFeedbackPrompt = ai.definePrompt({
  name: 'spendingInsightFeedbackPrompt',
  input: {schema: SpendingInsightFeedbackInputSchema},
  output: {schema: SpendingInsightFeedbackOutputSchema},
  prompt: `You are the CafePay Intelligent Engine. Your goal is to apply a Decision Tree Analysis to the following Purchase-Based Logging (PBL) data for academic expenditure tracking.

LOGICAL DECISION TREE STEPS:
1. BUDGET NODE: Is total spending > student budget? 
2. VARIANCE NODE: Which specific categories (Food, Stationery, etc) show >15% variance from their planned allocation?
3. FREQUENCY NODE: Is there a pattern of daily high-frequency low-value purchases? These are identified as "Financial Leakage".
4. CLASSIFICATION NODE: Classify the final leaf state as 'Survival' (Essential Food/Academic items) or 'Lifestyle' (Entertainment/Irrational spending).

Input Data:
Total Budget: {{totalBudget}}
Allocations: {{{json categoryBudgets}}}
Transaction Logs: {{{json spendingRecords}}}

Based on this Decision Tree traversal, provide:
1. 'decisionTreePath': A summary string of the logical path (e.g., 'Over-Budget -> Food Variance -> High Frequency Leakage').
2. 'classification': The mathematical Essentiality ratio and a list of specific 'leakagePoints' where spending was irrational.
3. 'overallFeedback': The final leaf node classification (Excellent, Warning, or Overspending).
4. 'suggestions': Tactical interventions to "prune" the decision tree and improve financial health.

Return strictly valid JSON.`,
});

const spendingInsightFeedbackFlow = ai.defineFlow(
  {
    name: 'spendingInsightFeedbackFlow',
    inputSchema: SpendingInsightFeedbackInputSchema,
    outputSchema: SpendingInsightFeedbackOutputSchema,
  },
  async input => {
    const {output} = await spendingInsightFeedbackPrompt(input);
    if (!output) {
      throw new Error('No output received from intelligence engine.');
    }
    return output;
  }
);

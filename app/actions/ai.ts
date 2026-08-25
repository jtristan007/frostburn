'use server'

import { getCurrentAccount } from '@/lib/account'
import { buildSnapshot } from '@/lib/ai/snapshot'
import { askClaude, type ChatMessage } from '@/lib/anthropic/client'

export async function askAssistant(history: ChatMessage[]): Promise<string> {
  const { supabase, account } = await getCurrentAccount()
  const snapshot = await buildSnapshot(supabase, account.name)

  const system = `You are Frostburn's AI assistant for ${account.name}, an HVAC service company using the Frostburn platform. You help the owner catch what needs attention: overdue invoices, agreements coming up for renewal, today's jobs, and equipment maintenance flags.

Only use the data below — never invent a customer, amount, date, or job that isn't in it. If something isn't covered by this data, say so plainly instead of guessing.

Keep replies short and direct — a sentence or two unless the question genuinely needs a list. No markdown formatting, this is read as plain text in a chat panel.

${snapshot}`

  return askClaude({ system, messages: history })
}

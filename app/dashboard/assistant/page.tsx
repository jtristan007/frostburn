import { AssistantChat } from '@/components/dashboard/assistant-chat'

export default function AssistantPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">AI Assistant</h1>
      <p className="text-sm text-gray-400 mb-6">
        Reads your live invoices, agreements, and jobs — ask it anything, it never guesses past what's on your board.
      </p>
      <AssistantChat />
    </div>
  )
}

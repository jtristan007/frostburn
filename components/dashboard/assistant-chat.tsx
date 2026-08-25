'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { askAssistant } from '@/app/actions/ai'
import type { ChatMessage } from '@/lib/anthropic/client'

type Turn = ChatMessage

const STARTER: Turn = {
  role: 'assistant',
  content: "Ask me about overdue invoices, agreements renewing soon, today's jobs, or anything else on your board.",
}

export function AssistantChat() {
  const [turns, setTurns] = useState<Turn[]>([STARTER])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [turns, isPending])

  function send() {
    const text = input.trim()
    if (!text || isPending) return
    setError(null)
    setInput('')
    const next = [...turns, { role: 'user' as const, content: text }]
    setTurns(next)
    startTransition(async () => {
      try {
        const reply = await askAssistant(next)
        setTurns((cur) => [...cur, { role: 'assistant', content: reply }])
      } catch {
        setError("Couldn't reach the assistant. Try again in a moment.")
      }
    })
  }

  return (
    <div className="bg-navy rounded-2xl border border-navy-mid overflow-hidden flex flex-col min-h-[520px]">
      <div className="px-5 py-3.5 border-b border-white/10 flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-ice shadow-[0_0_10px_2px_rgba(56,189,248,0.65)] animate-pulse" />
        <span className="text-sm font-bold text-white tracking-wide">FROSTBURN AI</span>
        <span className="ml-auto text-xs text-white/40">live</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {turns.map((t, i) => (
          <div key={i}>
            <div
              className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${
                t.role === 'user' ? 'text-white/40' : 'text-ice'
              }`}
            >
              {t.role === 'user' ? 'YOU' : 'FROSTBURN AI'}
            </div>
            <div className={`text-sm leading-relaxed ${t.role === 'user' ? 'text-white/65' : 'text-white/90'}`}>
              {t.content}
            </div>
          </div>
        ))}
        {isPending && <div className="text-sm text-white/40">Checking your data…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
      </div>

      <div className="flex gap-2 px-4 py-3.5 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about invoices, renewals, today's jobs…"
          className="flex-1 h-10 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm px-3 outline-none placeholder:text-white/35 focus:border-ice"
        />
        <button
          onClick={send}
          disabled={isPending}
          className="w-10 h-10 rounded-lg bg-ice text-navy flex items-center justify-center hover:bg-ice-dim disabled:opacity-50 flex-shrink-0"
          aria-label="Send"
        >
          →
        </button>
      </div>
    </div>
  )
}

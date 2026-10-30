import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'
import { connectAccount } from '@/lib/quickbooks/client'
import { getCurrentAccount } from '@/lib/account'

// state is the random nonce connectQuickBooks() (app/actions/quickbooks.ts)
// put in both the Intuit URL and an httpOnly cookie. They must match, so a
// callback link crafted by someone else can't attach their QuickBooks
// company to this account. The account comes from the live session.
const QB_STATE_COOKIE = 'qb_oauth_state'

function sameState(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const realmId = searchParams.get('realmId')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=${encodeURIComponent(error)}`)
  }

  const cookieStore = await cookies()
  const expectedState = cookieStore.get(QB_STATE_COOKIE)?.value
  cookieStore.delete({ name: QB_STATE_COOKIE, path: '/api/quickbooks' })

  if (!code || !realmId || !state) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=Missing+callback+parameters`)
  }

  if (!expectedState || !sameState(state, expectedState)) {
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=Session+mismatch`)
  }

  const { account } = await getCurrentAccount()

  try {
    await connectAccount(account.id, code, realmId)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not connect QuickBooks'
    return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?error=${encodeURIComponent(message)}`)
  }

  return NextResponse.redirect(`${origin}/dashboard/settings/quickbooks?connected=1`)
}

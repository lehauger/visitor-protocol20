import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ checkoutToken: string }> }
) {
  const { checkoutToken } = await params
  const visit = await db.visit.findUnique({ where: { checkoutToken } })
  if (!visit) return NextResponse.json({ error: 'Ikke funnet' }, { status: 404 })
  if (visit.checkedOutAt) return NextResponse.json({ error: 'Allerede utsjekket' }, { status: 409 })

  await db.visit.update({
    where: { checkoutToken },
    data: { checkedOutAt: new Date(), checkoutMethod: 'EMAIL_LINK' },
  })
  return NextResponse.json({ ok: true })
}

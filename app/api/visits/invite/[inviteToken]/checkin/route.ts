import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendCheckinNotification, sendCheckoutLink } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ inviteToken: string }> }) {
  const { inviteToken } = await params
  const visit = await db.visit.findUnique({
    where: { inviteToken },
    include: { host: true },
  })
  if (!visit) return NextResponse.json({ error: 'Ikke funnet' }, { status: 404 })
  if (visit.checkedInAt) return NextResponse.json({ error: 'Allerede innsjekket' }, { status: 409 })

  const updated = await db.visit.update({
    where: { inviteToken },
    data: { checkedInAt: new Date(), termsAcceptedAt: new Date() },
  })

  await Promise.all([
    sendCheckinNotification(visit.host.email, visit.host.name, visit.visitorName, visit.visitorCompany, visit.id),
    sendCheckoutLink(visit.visitorEmail, visit.visitorName, updated.checkoutToken),
  ])

  return NextResponse.json({ ok: true })
}

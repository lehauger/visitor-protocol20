import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { sendCheckinNotification, sendCheckoutLink } from '@/lib/email'

const schema = z.object({
  visitorName: z.string().min(1),
  visitorEmail: z.string().email(),
  visitorPhone: z.string().nullable().optional(),
  visitorCompany: z.string().nullable().optional(),
  doorId: z.string(),
  hostEmployeeId: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { data } = parsed
  const host = await db.employee.findUnique({ where: { id: data.hostEmployeeId } })
  if (!host) return NextResponse.json({ error: 'Vert ikke funnet' }, { status: 400 })

  const visit = await db.visit.create({
    data: {
      doorId: data.doorId,
      hostEmployeeId: data.hostEmployeeId,
      registeredById: session.user.id,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone ?? null,
      visitorCompany: data.visitorCompany ?? null,
      checkedInAt: new Date(),
      termsAcceptedAt: new Date(),
    },
  })

  await Promise.all([
    sendCheckinNotification(host.email, host.name, visit.visitorName, visit.visitorCompany, visit.id),
    sendCheckoutLink(visit.visitorEmail, visit.visitorName, visit.checkoutToken),
  ])

  return NextResponse.json({ ok: true }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { sendInvitation } from '@/lib/email'

const schema = z.object({
  visitorName: z.string().min(1),
  visitorEmail: z.string().email(),
  visitorCompany: z.string().nullable().optional(),
  doorId: z.string(),
  hostEmployeeId: z.string(),
  visitDate: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { data } = parsed
  const host = await db.employee.findUnique({ where: { id: data.hostEmployeeId } })
  if (!host) return NextResponse.json({ error: 'Vert ikke funnet' }, { status: 400 })

  const inviteToken = Math.random().toString(36).slice(2) + Date.now().toString(36)

  const visit = await db.visit.create({
    data: {
      doorId: data.doorId,
      hostEmployeeId: data.hostEmployeeId,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorCompany: data.visitorCompany ?? null,
      inviteToken,
    },
  })

  await sendInvitation(visit.visitorEmail, visit.visitorName, visit.inviteToken!, host.name, data.visitDate)
  return NextResponse.json({ ok: true }, { status: 201 })
}

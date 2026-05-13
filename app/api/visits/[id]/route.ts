import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/lib/db'

const schema = z.object({
  visitorName: z.string().min(1).optional(),
  visitorEmail: z.string().email().optional(),
  visitorPhone: z.string().nullable().optional(),
  visitorCompany: z.string().nullable().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 })
  if (!['ADMIN', 'RECEPTIONIST'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Ikke tillatelse' }, { status: 403 })
  }

  const { id } = await params
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const visit = await db.visit.findUnique({ where: { id } })
  if (!visit) return NextResponse.json({ error: 'Ikke funnet' }, { status: 404 })

  const updates = parsed.data
  const auditEntries = Object.entries(updates)
    .filter(([key, val]) => val !== undefined && String(val ?? '') !== String((visit as Record<string, unknown>)[key] ?? ''))
    .map(([fieldName, newValue]) => ({
      visitId: id,
      changedById: session.user.id,
      fieldName,
      oldValue: String((visit as Record<string, unknown>)[fieldName] ?? ''),
      newValue: String(newValue ?? ''),
    }))

  await db.$transaction([
    db.visit.update({ where: { id }, data: { ...updates, isModified: true } }),
    ...auditEntries.map(entry => db.visitAuditLog.create({ data: entry })),
  ])

  return NextResponse.json({ ok: true })
}

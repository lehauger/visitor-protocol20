import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Ugyldig e-post' }, { status: 400 })
  await db.visit.updateMany({
    where: { visitorEmail: parsed.data.email, isAnonymized: false },
    data: {
      visitorName: '[slettet]',
      visitorEmail: '[slettet]',
      visitorPhone: null,
      visitorCompany: '[slettet]',
      isAnonymized: true,
    },
  })
  return NextResponse.json({ ok: true })
}

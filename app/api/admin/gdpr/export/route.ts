import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Ugyldig e-post' }, { status: 400 })
  const visits = await db.visit.findMany({ where: { visitorEmail: parsed.data.email } })
  return new NextResponse(JSON.stringify(visits, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="gdpr-${parsed.data.email}.json"` },
  })
}

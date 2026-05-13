import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ name: z.string().min(1), address: z.string().nullable().optional() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  const location = await db.location.create({ data: parsed.data })
  return NextResponse.json(location, { status: 201 })
}

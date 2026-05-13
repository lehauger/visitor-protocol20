import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ locationId: z.string(), name: z.string().min(1) })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  const door = await db.door.create({ data: parsed.data })
  return NextResponse.json(door, { status: 201 })
}

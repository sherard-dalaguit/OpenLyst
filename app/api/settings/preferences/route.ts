import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/database/user.model'

export async function PUT(request: Request) {
  const { userId, categories, frequency } = await request.json()
  await dbConnect()

  const user = await User.findById(userId)
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  user.preferences.categories = categories
  user.preferences.frequency = frequency
  await user.save()

  return NextResponse.json({ success: true })
}

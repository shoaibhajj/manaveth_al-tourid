import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const FILE_PATH = path.join(process.cwd(), '.next', 'cache', 'company_comments.json')

function getStoredComments(): Record<string, any[]> {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch {
    // Ignore error
  }
  return {}
}

function saveComments(comments: Record<string, any[]>) {
  try {
    const dir = path.dirname(FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(comments, null, 2), 'utf-8')
  } catch {
    // Ignore error
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const postId = url.searchParams.get('postId')
  const allComments = getStoredComments()

  if (postId) {
    return NextResponse.json({ success: true, comments: allComments[postId] || [] })
  }

  return NextResponse.json({ success: true, comments: allComments })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, author, role, text, rating } = body

    if (!postId || !author?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: author.trim(),
      role: role?.trim() || undefined,
      text: text.trim(),
      rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 5,
      date: 'الآن',
      createdAt: new Date().toISOString(),
    }

    const allComments = getStoredComments()
    const postComments = allComments[postId] || []
    allComments[postId] = [newComment, ...postComments]

    saveComments(allComments)

    return NextResponse.json({ success: true, comment: newComment, comments: allComments[postId] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const postId = url.searchParams.get('postId')
    const commentId = url.searchParams.get('commentId')

    if (!postId || !commentId) {
      return NextResponse.json({ error: 'postId and commentId are required' }, { status: 400 })
    }

    const allComments = getStoredComments()
    if (allComments[postId]) {
      allComments[postId] = allComments[postId].filter((c: any) => c.id !== commentId)
      saveComments(allComments)
    }

    return NextResponse.json({ success: true, remaining: allComments[postId] || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import fs from 'fs'
import path from 'path'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'

const FILE_PATH = path.join(process.cwd(), '.next', 'cache', 'company_comments.json')

// Rate limiting in-memory store (sliding window per IP)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps)
    return true
  }

  validTimestamps.push(now)
  rateLimitMap.set(ip, validTimestamps)
  return false
}

function getStoredComments(): Record<string, any[]> {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch {}
  return {}
}

function saveComments(comments: Record<string, any[]>) {
  try {
    const dir = path.dirname(FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(comments, null, 2), 'utf-8')
  } catch {}
}

function getSanityClient() {
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN_2 ||
    process.env.SANITY_API_READ_TOKEN
  if (!token || !isSanityConfigured) return null
  return createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    token,
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const postId = url.searchParams.get('postId')
  const client = getSanityClient()

  if (client) {
    try {
      if (postId) {
        const post = await client.fetch(
          '*[_type == "companyPost" && (_id == $id || slug.current == $id)][0]{ comments }',
          { id: postId }
        )
        const comments = (post?.comments || []).filter((c: any) => c.approved !== false)
        return NextResponse.json({ success: true, comments })
      } else {
        const posts = await client.fetch('*[_type == "companyPost"]{ _id, comments }')
        const commentsMap: Record<string, any[]> = {}
        for (const p of posts) {
          if (p.comments?.length) {
            commentsMap[p._id] = p.comments.filter((c: any) => c.approved !== false)
          }
        }
        return NextResponse.json({ success: true, comments: commentsMap })
      }
    } catch {}
  }

  const allComments = getStoredComments()
  if (postId) {
    const comments = (allComments[postId] || []).filter((c: any) => c.approved !== false)
    return NextResponse.json({ success: true, comments })
  }
  return NextResponse.json({ success: true, comments: allComments })
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another comment.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { postId, author, role, text, rating, website, honeypot } = body

    // 2. Honeypot anti-spam check
    if (website || honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 })
    }

    if (!postId || !author?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const commentId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const newComment = {
      _key: commentId,
      id: commentId,
      commentId,
      author: author.trim().slice(0, 80),
      role: role?.trim()?.slice(0, 80) || undefined,
      text: text.trim().slice(0, 1000),
      rating: typeof rating === 'number' && rating >= 1 && rating <= 5 ? rating : 5,
      date: 'الآن',
      approved: true, // Marked active or pending
      createdAt: new Date().toISOString(),
    }

    // Save in Sanity if configured
    const client = getSanityClient()
    if (client) {
      try {
        await client
          .patch(postId)
          .setIfMissing({ comments: [] })
          .prepend('comments', [
            {
              _key: commentId,
              commentId,
              author: newComment.author,
              role: newComment.role || '',
              text: newComment.text,
              rating: newComment.rating,
              approved: true,
              date: 'الآن',
            },
          ])
          .commit()
      } catch (err: any) {
        console.error('Failed to commit comment to Sanity:', err.message)
      }
    }

    // Also save in local cache
    const allComments = getStoredComments()
    const postComments = allComments[postId] || []
    allComments[postId] = [newComment, ...postComments]
    saveComments(allComments)

    return NextResponse.json({
      success: true,
      comment: newComment,
      comments: allComments[postId],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE requires authenticated server authorization (ADMIN_API_SECRET)
export async function DELETE(request: Request) {
  try {
    const adminSecret = process.env.ADMIN_API_SECRET
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    // Check authorization: must match ADMIN_API_SECRET
    if (!adminSecret || token !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: admin credentials required to delete comments' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const postId = url.searchParams.get('postId')
    const commentId = url.searchParams.get('commentId')

    if (!postId || !commentId) {
      return NextResponse.json({ error: 'postId and commentId are required' }, { status: 400 })
    }

    const client = getSanityClient()
    if (client) {
      try {
        await client
          .patch(postId)
          .unset([`comments[commentId=="${commentId}"]`, `comments[_key=="${commentId}"]`])
          .commit()
      } catch (err: any) {
        console.error('Failed to unset comment in Sanity:', err.message)
      }
    }

    const allComments = getStoredComments()
    if (allComments[postId]) {
      allComments[postId] = allComments[postId].filter(
        (c: any) => c.id !== commentId && c.commentId !== commentId
      )
      saveComments(allComments)
    }

    return NextResponse.json({ success: true, remaining: allComments[postId] || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

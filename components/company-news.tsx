'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import { useContent, useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { initialCompanyPosts, type CompanyPost, type PostComment } from '@/lib/content/company-news'

interface CompanyNewsProps {
  customTitle?: { ar: string; en: string }
  customSubtitle?: { ar: string; en: string }
}

export function CompanyNews({ customTitle, customSubtitle }: CompanyNewsProps) {
  const { t, locale } = useLocale()
  const { companyPosts } = useContent()
  const posts: CompanyPost[] = companyPosts && companyPosts.length > 0 ? companyPosts : initialCompanyPosts
  const [selectedPost, setSelectedPost] = useState<CompanyPost | null>(null)

  // Likes state: record of postId -> { count: number, userLiked: boolean }
  const [likesState, setLikesState] = useState<Record<string, { count: number; userLiked: boolean }>>({})

  // Comments state: record of postId -> PostComment[]
  const [commentsState, setCommentsState] = useState<Record<string, PostComment[]>>({})

  // Comment form fields
  const [authorName, setAuthorName] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Initialize from localStorage and sync with server comments API on mount
  useEffect(() => {
    try {
      const initialLikes: Record<string, { count: number; userLiked: boolean }> = {}
      const initialComments: Record<string, PostComment[]> = {}

      posts.forEach((p) => {
        const storedLiked = localStorage.getItem(`mnaveth_liked_${p.id}`) === 'true'
        const storedCountOffset = Number(localStorage.getItem(`mnaveth_likes_offset_${p.id}`) || '0')
        initialLikes[p.id] = {
          count: p.initialLikes + storedCountOffset,
          userLiked: storedLiked,
        }

        const localCommentsJson = localStorage.getItem(`mnaveth_comments_${p.id}`)
        const userAddedComments: PostComment[] = localCommentsJson ? JSON.parse(localCommentsJson) : []
        initialComments[p.id] = [...userAddedComments, ...p.initialComments]
      })

      setLikesState(initialLikes)
      setCommentsState(initialComments)

      // Fetch global server-stored comments asynchronously
      fetch('/api/company-news/comments')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.comments) {
            setCommentsState((prev) => {
              const updated = { ...prev }
              const serverData = data.comments as Record<string, PostComment[]>
              for (const [pId, sList] of Object.entries(serverData)) {
                const current = updated[pId] || []
                const existingIds = new Set(current.map((c) => c.id))
                const uniqueNew = sList.filter((c) => !existingIds.has(c.id))
                if (uniqueNew.length > 0) {
                  updated[pId] = [...uniqueNew, ...current]
                }
              }
              return updated
            })
          }
        })
        .catch(() => {})
    } catch {
      // Fallback
      const defaultLikes: Record<string, { count: number; userLiked: boolean }> = {}
      const defaultComments: Record<string, PostComment[]> = {}
      posts.forEach((p) => {
        defaultLikes[p.id] = { count: p.initialLikes, userLiked: false }
        defaultComments[p.id] = p.initialComments
      })
      setLikesState(defaultLikes)
      setCommentsState(defaultComments)
    }
  }, [posts])

  // Toggle Like
  const handleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setLikesState((prev) => {
      const current = prev[postId] || { count: 0, userLiked: false }
      const willLike = !current.userLiked
      const newCount = willLike ? current.count + 1 : Math.max(0, current.count - 1)
      const offset = willLike ? 1 : 0

      try {
        localStorage.setItem(`mnaveth_liked_${postId}`, willLike ? 'true' : 'false')
        localStorage.setItem(`mnaveth_likes_offset_${postId}`, String(offset))
      } catch {
        // Ignore localStorage error
      }

      return {
        ...prev,
        [postId]: { count: newCount, userLiked: willLike },
      }
    })
  }

  // Handle Comment Submission with 5-Star Rating
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !authorName.trim() || !commentText.trim()) return

    const newComment: PostComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: authorName.trim(),
      role: authorRole.trim() || undefined,
      text: commentText.trim(),
      rating: rating >= 1 && rating <= 5 ? rating : 5,
      date: locale === 'ar' ? 'الآن' : 'Just now',
    }

    setCommentsState((prev) => {
      const list = prev[selectedPost.id] || []
      const updated = [newComment, ...list]
      try {
        const storedJson = localStorage.getItem(`mnaveth_comments_${selectedPost.id}`)
        const userList = storedJson ? JSON.parse(storedJson) : []
        localStorage.setItem(`mnaveth_comments_${selectedPost.id}`, JSON.stringify([newComment, ...userList]))
      } catch {
        // Ignore localStorage error
      }
      return { ...prev, [selectedPost.id]: updated }
    })

    // Also persist to server API asynchronously
    try {
      fetch('/api/company-news/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: selectedPost.id,
          author: newComment.author,
          role: newComment.role,
          text: newComment.text,
          rating: newComment.rating,
        }),
      }).catch(() => {})
    } catch {
      // Ignore network error
    }

    setCommentText('')
    setRating(5)
    setCommentSuccess(true)
    setTimeout(() => setCommentSuccess(false), 4000)
  }

  // Handle Delete Comment
  const handleDeleteComment = (postId: string, commentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const confirmMsg = locale === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Are you sure you want to delete this comment?'
    if (!window.confirm(confirmMsg)) return

    setCommentsState((prev) => {
      const list = prev[postId] || []
      const updated = list.filter((c) => c.id !== commentId)
      try {
        const storedJson = localStorage.getItem(`mnaveth_comments_${postId}`)
        if (storedJson) {
          const userList: PostComment[] = JSON.parse(storedJson)
          const filtered = userList.filter((c) => c.id !== commentId)
          localStorage.setItem(`mnaveth_comments_${postId}`, JSON.stringify(filtered))
        }
      } catch {
        // Ignore error
      }
      return { ...prev, [postId]: updated }
    })

    // Delete on server
    try {
      fetch(`/api/company-news/comments?postId=${encodeURIComponent(postId)}&commentId=${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
      }).catch(() => {})
    } catch {
      // Ignore network error
    }
  }

  // Handle Share WhatsApp
  const handleShareWhatsApp = (post: CompanyPost) => {
    const title = t(post.title)
    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.mnaveth-altourid.com'
    const text = encodeURIComponent(`${title}\n\n${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  // Handle Copy Link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
    }
  }

  const badgeIcons = {
    event: Sparkles,
    partnership: TrendingUp,
    quality: Award,
    award: Award,
    logistics: Clock,
  }

  return (
    <section id="company-news" className="relative overflow-hidden py-20 md:py-28 bg-forest-deep/5">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-bold text-gold mb-3">
              <Sparkles className="size-3.5" />
              <span>{t({ ar: 'جديدنا وأحدث مشاركاتنا', en: 'Latest News & Events' })}</span>
            </div>
            <h2 className="text-balance text-3xl font-extrabold text-forest md:text-4xl">
              {customTitle
                ? t(customTitle)
                : t({
                    ar: 'نبض «منافذ التوريد» | مستجدات، شراكات، وإنجازات',
                    en: 'Mnaveth ALTourid Highlights | News, Events & Milestones',
                  })}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
              {customSubtitle
                ? t(customSubtitle)
                : t({
                    ar: 'واكب أحدث مشاركاتنا في المعارض الدولية، الوكالات الحصرية، واعتمادات الجودة التي تعزز ريادتنا في سلاسل الإمداد بالمملكة.',
                    en: 'Follow our international expos, exclusive import agencies, and ISO quality achievements powering the Saudi food supply chain.',
                  })}
            </p>
          </Reveal>
        </div>

        {/* Stories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, idx) => {
            const BadgeIcon = badgeIcons[post.badgeType] || Sparkles
            const likesInfo = likesState[post.id] || { count: post.initialLikes, userLiked: false }
            const postComments = commentsState[post.id] || post.initialComments
            const commentsCount = postComments.length
            const avgRating =
              postComments.length > 0
                ? (postComments.reduce((acc, c) => acc + (c.rating || 5), 0) / postComments.length).toFixed(1)
                : '5.0'

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedPost(post)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl cursor-pointer text-start"
              >
                {/* Media Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={post.coverImage}
                    alt={t(post.title)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-deep/90 px-3 py-1 text-xs font-bold text-gold shadow-md backdrop-blur-md">
                      <BadgeIcon className="size-3.5" />
                      <span>{t(post.badge)}</span>
                    </span>

                    {/* Star Rating Badge */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest-deep/90 px-2.5 py-1 text-xs font-bold text-amber-400 shadow-md backdrop-blur-md">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      <span>{avgRating}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-cream/90">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="size-3.5 text-gold" />
                      <span>{post.publishedAt}</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="size-3.5 text-gold" />
                      <span>{t(post.readTime)}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-forest leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {t(post.title)}
                    </h3>
                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {t(post.excerpt)}
                    </p>
                  </div>

                  {/* Footer Interactive Actions */}
                  <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={(e) => handleLike(post.id, e)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1.5 transition-colors ${
                          likesInfo.userLiked
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-muted/50 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500'
                        }`}
                        aria-label={t({ ar: 'أعجبني', en: 'Like' })}
                      >
                        <motion.span whileTap={{ scale: 1.35 }} className="flex items-center">
                          <Heart
                            className={`size-4 transition-colors ${
                              likesInfo.userLiked ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                        </motion.span>
                        <span>{likesInfo.count}</span>
                      </button>

                      {/* Comment indicator */}
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground px-2 py-1.5 rounded-lg bg-muted/40">
                        <MessageSquare className="size-3.5" />
                        <span>{commentsCount}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-gold group-hover:underline">
                      {t({ ar: 'التفاصيل والتقييمات ←', en: 'Details & Reviews →' })}
                    </span>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>

      {/* Rich Modal for Full Post Details & Interactive Comments */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(selectedPost.title)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-forest-deep/90 p-4 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/40 bg-card shadow-2xl text-start"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                aria-label={t({ ar: 'إغلاق', en: 'Close' })}
                className="absolute top-4 end-4 z-20 flex size-9 items-center justify-center rounded-full bg-forest-deep/80 text-cream hover:bg-gold hover:text-forest transition-colors shadow-lg"
              >
                <X className="size-5" />
              </button>

              {/* Modal Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                <Image
                  src={selectedPost.coverImage}
                  alt={t(selectedPost.title)}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent" />
                <div className="absolute bottom-4 inset-x-6 flex flex-wrap items-center justify-between gap-3 text-xs text-cream">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1 font-extrabold text-forest-deep">
                    {t(selectedPost.badge)}
                  </span>
                  <div className="flex items-center gap-4">
                    <span>{selectedPost.publishedAt}</span>
                    <span>•</span>
                    <span>{t(selectedPost.author)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-extrabold text-forest md:text-3xl leading-snug">
                    {t(selectedPost.title)}
                  </h2>
                  <p className="mt-3 text-base text-gold font-bold leading-relaxed">
                    {t(selectedPost.excerpt)}
                  </p>
                </div>

                {/* Paragraphs */}
                <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
                  {selectedPost.body.map((p, idx) => (
                    <p key={idx}>{t(p)}</p>
                  ))}
                </div>

                {/* Key Highlights */}
                {selectedPost.highlights && selectedPost.highlights.length > 0 && (
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 space-y-2.5">
                    <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">
                      {t({ ar: 'أبرز المخرجات والنقاط الرئيسية', en: 'Key Takeaways & Highlights' })}
                    </h4>
                    <ul className="space-y-2">
                      {selectedPost.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-forest">
                          <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
                          <span>{t(h)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Engagement Bar inside Modal */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLike(selectedPost.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        likesState[selectedPost.id]?.userLiked
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-muted text-foreground hover:bg-rose-500/10 hover:text-rose-500'
                      }`}
                    >
                      <Heart
                        className={`size-4 ${
                          likesState[selectedPost.id]?.userLiked ? 'fill-white' : ''
                        }`}
                      />
                      <span>{t({ ar: 'أعجبني', en: 'Like' })}</span>
                      <span className="font-extrabold">({likesState[selectedPost.id]?.count || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(selectedPost)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                    >
                      <Share2 className="size-4" />
                      <span>{t({ ar: 'مشاركة عبر واتساب', en: 'Share on WhatsApp' })}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-gold transition"
                  >
                    <Copy className="size-3.5" />
                    <span>
                      {copySuccess
                        ? t({ ar: 'تم النسخ!', en: 'Copied!' })
                        : t({ ar: 'نسخ الرابط', en: 'Copy Link' })}
                    </span>
                  </button>
                </div>

                {/* Interactive Discussion / Comments Area with Ratings & Deletion */}
                <div className="pt-6 border-t border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-forest flex items-center gap-2">
                      <MessageSquare className="size-5 text-gold" />
                      <span>{t({ ar: 'التقييمات والتعليقات', en: 'Ratings & Reviews' })}</span>
                      <span className="text-xs font-bold text-muted-foreground rounded-full bg-muted px-2.5 py-0.5">
                        {(commentsState[selectedPost.id] || []).length}
                      </span>
                    </h3>
                  </div>

                  {/* Add Comment Form with 5-Star Rating */}
                  <form onSubmit={handleAddComment} className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                      <p className="text-xs font-bold text-forest">
                        {t({ ar: 'أضف تقييمك ورأيك حول هذا الخبر / الإنجاز:', en: 'Rate & share your feedback on this milestone:' })}
                      </p>

                      {/* 5-Star Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {t({ ar: 'التقييم:', en: 'Rating:' })}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                              aria-label={`${star} stars`}
                            >
                              <Star
                                className={`size-5 transition-colors ${
                                  star <= (hoverRating || rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-border'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600">
                          {hoverRating || rating} / 5
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={t({ ar: 'اسمك الكريم *', en: 'Your Name *' })}
                        className="rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      />
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        placeholder={t({ ar: 'الجهة / المنصب (مثال: مدير مطعم) - اختياري', en: 'Role / Company - Optional' })}
                        className="rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                      />
                    </div>

                    <textarea
                      required
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={t({ ar: 'اكتب تقييمك أو تعليقك هنا...', en: 'Write your review or comment here...' })}
                      className="w-full rounded-lg border border-border bg-background p-3 text-xs font-medium text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                    />

                    <div className="flex items-center justify-between">
                      {commentSuccess ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          <span>{t({ ar: 'تم نشر تقييمك بنجاح!', en: 'Review posted successfully!' })}</span>
                        </span>
                      ) : <span />}

                      <button
                        type="submit"
                        className="rounded-lg bg-forest px-5 py-2 text-xs font-extrabold text-cream hover:bg-gold hover:text-forest-deep transition-colors shadow-sm"
                      >
                        {t({ ar: 'نشر التقييم والتعليق', en: 'Post Review' })}
                      </button>
                    </div>
                  </form>

                  {/* Comments List with Star Ratings & Delete Button */}
                  <div className="space-y-3 pt-2">
                    {(commentsState[selectedPost.id] || []).map((comm) => (
                      <div
                        key={comm.id}
                        className="group relative rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1.5 transition hover:border-gold/40"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-forest">{comm.author}</span>
                            {comm.role && (
                              <span className="rounded-md bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                                {comm.role}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Stars */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`size-3.5 ${
                                    idx < (comm.rating || 5)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-border'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-muted-foreground">{comm.date}</span>

                            {/* Delete Comment Button */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteComment(selectedPost.id, comm.id, e)}
                              title={t({ ar: 'حذف هذا التعليق', en: 'Delete this comment' })}
                              className="rounded p-1 text-muted-foreground opacity-70 transition hover:bg-red-500/10 hover:text-red-600 hover:opacity-100"
                              aria-label={t({ ar: 'حذف التعليق', en: 'Delete comment' })}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed pt-1">{comm.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

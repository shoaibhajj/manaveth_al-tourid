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
  const [commentSuccess, setCommentSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Initialize from localStorage on mount
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

  // Handle Comment Submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !authorName.trim() || !commentText.trim()) return

    const newComment: PostComment = {
      id: `comm_${Date.now()}`,
      author: authorName.trim(),
      role: authorRole.trim() || undefined,
      text: commentText.trim(),
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

    setCommentText('')
    setCommentSuccess(true)
    setTimeout(() => setCommentSuccess(false), 4000)
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

  return (
    <section id="company-news" className="relative py-20 md:py-28 bg-gradient-to-b from-forest-deep/5 via-card/50 to-transparent border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-bold text-gold">
              <Sparkles className="size-3.5" />
              <span>{t({ ar: 'نبض منافذ التوريد', en: 'Mnaveth Pulse' })}</span>
            </div>
            <h2 className="mt-3 text-balance text-3xl font-extrabold text-forest md:text-4xl">
              {customTitle
                ? t(customTitle)
                : t({ ar: 'جديدنا وأحدث مشاركاتنا وإنجازاتنا', en: 'Latest Highlights & Company News' })}
            </h2>
            <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
              {customSubtitle
                ? t(customSubtitle)
                : t({
                    ar: 'متابعة حية لحضورنا الميداني في المعارض الدولية، الوكالات الحصرية، واعتمادات الجودة لسلاسل التوريد بالمملكة.',
                    en: 'Live updates on international expos, exclusive agency partnerships, and verified quality milestones in Saudi Arabia.',
                  })}
            </p>
          </Reveal>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-forest/5 rounded-xl px-4 py-2 border border-border">
            <TrendingUp className="size-4 text-gold" />
            <span>{t({ ar: 'تحديثات مستمرة وتفاعل مباشر', en: 'Live updates & verified milestones' })}</span>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => {
            const likesInfo = likesState[post.id] || { count: post.initialLikes, userLiked: false }
            const commentsCount = (commentsState[post.id] || post.initialComments).length

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setSelectedPost(post)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl cursor-pointer"
              >
                {/* Media Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-deep/10">
                  <Image
                    src={post.coverImage}
                    alt={t(post.title)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-black/20" />

                  {/* Badge */}
                  <span className="absolute top-3.5 start-3.5 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/90 px-3 py-1 text-xs font-bold text-gold ring-1 ring-gold/30 backdrop-blur-md">
                    <Award className="size-3" />
                    <span>{t(post.badge)}</span>
                  </span>

                  {post.pinned && (
                    <span className="absolute top-3.5 end-3.5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-extrabold text-forest-deep">
                      {t({ ar: 'مميز', en: 'Featured' })}
                    </span>
                  )}

                  {/* Date & Read time */}
                  <div className="absolute bottom-3 start-3.5 flex items-center gap-3 text-xs text-cream/90 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-gold" />
                      <span>{post.publishedAt}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-gold" />
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
                      {t({ ar: 'التفاصيل والتعليقات ←', en: 'Details & Discussion →' })}
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
                className="absolute top-4 end-4 z-20 flex size-10 items-center justify-center rounded-full bg-forest-deep/80 text-cream backdrop-blur-md transition-all hover:bg-gold hover:text-forest-deep ring-1 ring-cream/20"
              >
                <X className="size-5" />
              </button>

              {/* Cover Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest-deep/20">
                <Image src={selectedPost.coverImage} alt={t(selectedPost.title)} fill sizes="90vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute bottom-4 start-6 end-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1 text-xs font-bold text-gold ring-1 ring-gold/40">
                    <Award className="size-3.5" />
                    <span>{t(selectedPost.badge)}</span>
                  </span>
                  <div className="mt-2 flex items-center gap-4 text-xs text-cream/90 font-medium">
                    <span>{selectedPost.publishedAt}</span>
                    <span>•</span>
                    <span>{t(selectedPost.author)}</span>
                    <span>•</span>
                    <span>{t(selectedPost.readTime)}</span>
                  </div>
                </div>
              </div>

              {/* Post Body Content */}
              <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                <h2 className="text-2xl font-extrabold text-forest md:text-3xl leading-snug">
                  {t(selectedPost.title)}
                </h2>

                <p className="text-base font-semibold text-gold leading-relaxed border-s-4 border-gold ps-3">
                  {t(selectedPost.excerpt)}
                </p>

                <div className="space-y-4 text-base text-foreground/90 leading-relaxed">
                  {selectedPost.body.map((para, i) => (
                    <p key={i}>{t(para)}</p>
                  ))}
                </div>

                {/* Key Highlights */}
                {selectedPost.highlights && selectedPost.highlights.length > 0 && (
                  <div className="rounded-xl border border-border bg-forest/5 p-4 space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-forest">
                      {t({ ar: 'أبرز المخرجات والنتائج:', en: 'Key Highlights:' })}
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      {selectedPost.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground/90 font-medium">
                          <CheckCircle2 className="size-4 shrink-0 text-gold" />
                          <span>{t(h)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social Share & Interactions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {/* Like button in modal */}
                    <button
                      type="button"
                      onClick={() => handleLike(selectedPost.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-sm transition-all ${
                        likesState[selectedPost.id]?.userLiked
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-muted text-foreground hover:bg-rose-500/10 hover:text-rose-500'
                      }`}
                    >
                      <Heart
                        className={`size-4.5 ${
                          likesState[selectedPost.id]?.userLiked ? 'fill-white' : ''
                        }`}
                      />
                      <span>
                        {likesState[selectedPost.id]?.userLiked
                          ? t({ ar: 'أعجبك هذا المنشور', en: 'Liked!' })
                          : t({ ar: 'أعجبني', en: 'Like' })}
                      </span>
                      <span className="opacity-90">({likesState[selectedPost.id]?.count || 0})</span>
                    </button>

                    {/* WhatsApp Share */}
                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(selectedPost)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-forest hover:bg-forest hover:text-cream transition-colors"
                    >
                      <Share2 className="size-3.5 text-gold" />
                      <span>{t({ ar: 'مشاركة عبر واتساب', en: 'Share on WhatsApp' })}</span>
                    </button>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:border-gold hover:text-forest transition-colors"
                    >
                      <Copy className="size-3.5" />
                      <span>
                        {copySuccess
                          ? t({ ar: 'تم النسخ!', en: 'Copied!' })
                          : t({ ar: 'نسخ الرابط', en: 'Copy Link' })}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Interactive Discussion / Comments Area */}
                <div className="pt-6 border-t border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-forest flex items-center gap-2">
                      <MessageSquare className="size-5 text-gold" />
                      <span>{t({ ar: 'التعليقات والمشاركات', en: 'Community Discussion' })}</span>
                      <span className="text-xs font-bold text-muted-foreground rounded-full bg-muted px-2.5 py-0.5">
                        {(commentsState[selectedPost.id] || []).length}
                      </span>
                    </h3>
                  </div>

                  {/* Add Comment Form (Simple: Name + Role + Text, No friction) */}
                  <form onSubmit={handleAddComment} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <p className="text-xs font-bold text-forest">
                      {t({ ar: 'أضف تعليقك أو استفسارك التجاري حول هذا الحدث:', en: 'Add your comment or trade inquiry:' })}
                    </p>

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
                      placeholder={t({ ar: 'اكتب مشاركتك هنا...', en: 'Write your thoughts or inquiry...' })}
                      className="w-full rounded-lg border border-border bg-background p-3 text-xs font-medium text-foreground outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                    />

                    <div className="flex items-center justify-between">
                      {commentSuccess ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          <span>{t({ ar: 'تم نشر تعليقك بنجاح!', en: 'Comment posted successfully!' })}</span>
                        </span>
                      ) : <span />}

                      <button
                        type="submit"
                        className="rounded-lg bg-forest px-4 py-2 text-xs font-extrabold text-cream hover:bg-gold hover:text-forest-deep transition-colors shadow-sm"
                      >
                        {t({ ar: 'نشر التعليق', en: 'Post Comment' })}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 pt-2">
                    {(commentsState[selectedPost.id] || []).map((comm) => (
                      <div key={comm.id} className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-forest">{comm.author}</span>
                            {comm.role && (
                              <span className="rounded-md bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                                {comm.role}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">{comm.date}</span>
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

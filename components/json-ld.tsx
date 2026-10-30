export function JsonLd({ graph }: { graph: unknown[] }) {
  if (graph.length === 0) return null
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

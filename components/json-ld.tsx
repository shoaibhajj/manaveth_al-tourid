export function JsonLd({
  graph,
  schema,
}: {
  graph?: unknown[]
  schema?: Record<string, unknown> | unknown[]
}) {
  if (Array.isArray(graph)) {
    if (graph.length === 0) return null
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  }

  if (schema) {
    const payload =
      typeof schema === 'object' && schema !== null && '@context' in (schema as Record<string, unknown>)
        ? schema
        : { '@context': 'https://schema.org', ...(Array.isArray(schema) ? { '@graph': schema } : (schema as Record<string, unknown>)) }
    const json = JSON.stringify(payload).replace(/</g, '\\u003c')
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  }

  return null
}

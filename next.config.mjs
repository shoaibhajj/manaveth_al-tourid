/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/menu',
      destination: '/catalog',
      permanent: true,
    },
    {
      source: '/en/menu',
      destination: '/en/catalog',
      permanent: true,
    },
    // F2: 301 Permanent Redirects from SKU parameters to canonical semantic product slugs
    { source: '/products/mnv-rc-1121', destination: '/products/basmati-rice', permanent: true },
    { source: '/en/products/mnv-rc-1121', destination: '/en/products/basmati-rice', permanent: true },
    { source: '/products/mnv-bf-03', destination: '/products/frozen-liver', permanent: true },
    { source: '/en/products/mnv-bf-03', destination: '/en/products/frozen-liver', permanent: true },
    { source: '/products/mnv-bf-01', destination: '/products/frozen-brazilian-beef-topside', permanent: true },
    { source: '/en/products/mnv-bf-01', destination: '/en/products/frozen-brazilian-beef-topside', permanent: true },
    { source: '/products/mnv-bf-02', destination: '/products/frozen-beef-silverside', permanent: true },
    { source: '/en/products/mnv-bf-02', destination: '/en/products/frozen-beef-silverside', permanent: true },
    { source: '/products/mnv-bf-04', destination: '/products/wholesale-frozen-beef', permanent: true },
    { source: '/en/products/mnv-bf-04', destination: '/en/products/wholesale-frozen-beef', permanent: true },
    { source: '/products/mnv-pl-01', destination: '/products/frozen-boneless-chicken-breast', permanent: true },
    { source: '/en/products/mnv-pl-01', destination: '/en/products/frozen-boneless-chicken-breast', permanent: true },
    { source: '/products/mnv-pl-02', destination: '/products/frozen-whole-chicken-griller', permanent: true },
    { source: '/en/products/mnv-pl-02', destination: '/en/products/frozen-whole-chicken-griller', permanent: true },
    { source: '/products/mnv-rc-1122', destination: '/products/long-grain-white-sella-rice', permanent: true },
    { source: '/en/products/mnv-rc-1122', destination: '/en/products/long-grain-white-sella-rice', permanent: true },
    { source: '/products/mnv-ol-01', destination: '/products/pure-corn-oil-catering', permanent: true },
    { source: '/en/products/mnv-ol-01', destination: '/en/products/pure-corn-oil-catering', permanent: true },
    { source: '/products/mnv-ol-02', destination: '/products/pure-sunflower-oil-catering', permanent: true },
    { source: '/en/products/mnv-ol-02', destination: '/en/products/pure-sunflower-oil-catering', permanent: true },
    { source: '/products/mnv-cn-01', destination: '/products/tomato-paste-canned-a10', permanent: true },
    { source: '/en/products/mnv-cn-01', destination: '/en/products/tomato-paste-canned-a10', permanent: true },
    { source: '/products/mnv-cn-02', destination: '/products/canned-fava-beans-catering', permanent: true },
    { source: '/en/products/mnv-cn-02', destination: '/en/products/canned-fava-beans-catering', permanent: true },
    { source: '/products/mnv-cn-03', destination: '/products/canned-chickpeas-catering', permanent: true },
    { source: '/en/products/mnv-cn-03', destination: '/en/products/canned-chickpeas-catering', permanent: true },
    { source: '/products/mnv-vg-01', destination: '/products/frozen-french-fries-9x9', permanent: true },
    { source: '/en/products/mnv-vg-01', destination: '/en/products/frozen-french-fries-9x9', permanent: true },
    { source: '/products/mnv-vg-02', destination: '/products/frozen-mixed-vegetables', permanent: true },
    { source: '/en/products/mnv-vg-02', destination: '/en/products/frozen-mixed-vegetables', permanent: true },
    { source: '/products/mnv-dt-01', destination: '/products/saghai-dates-wholesale', permanent: true },
    { source: '/en/products/mnv-dt-01', destination: '/en/products/saghai-dates-wholesale', permanent: true },
    { source: '/products/mnv-dt-02', destination: '/products/khalas-al-qassim-dates', permanent: true },
    { source: '/en/products/mnv-dt-02', destination: '/en/products/khalas-al-qassim-dates', permanent: true },
    { source: '/products/mnv-pk-01', destination: '/products/heavy-duty-aluminum-foil-catering', permanent: true },
    { source: '/en/products/mnv-pk-01', destination: '/en/products/heavy-duty-aluminum-foil-catering', permanent: true },
    { source: '/products/mnv-pk-02', destination: '/products/cling-film-wrap-food-grade', permanent: true },
    { source: '/en/products/mnv-pk-02', destination: '/en/products/cling-film-wrap-food-grade', permanent: true },
    // F5: 301 Permanent Redirect for updated 22-year legacy article slug
    {
      source: '/blog/24-years-excellence-food-supply-saudi-arabia-since-2004',
      destination: '/blog/22-years-excellence-food-supply-saudi-arabia-since-2004',
      permanent: true,
    },
    {
      source: '/en/blog/24-years-excellence-food-supply-saudi-arabia-since-2004',
      destination: '/en/blog/22-years-excellence-food-supply-saudi-arabia-since-2004',
      permanent: true,
    },
  ],
}

export default nextConfig

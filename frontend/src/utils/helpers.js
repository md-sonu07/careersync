export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date))

export const timeSince = (dateString) => {
  if (!dateString) return 'Recently'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Recently'

  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'Just now'

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  return 'Just now'
}

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 100% Self-contained vector brand logos (immune to CDN / CORS / Network blocks)
const FLIPKART_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%232874F0"/><path d="M25 32H75L68 76H32L25 32Z" fill="%23FFE11B"/><path d="M42 22C42 17.6 45.6 14 50 14C54.4 14 58 17.6 58 22V32H42V22Z" fill="white"/><path d="M48 42H58V48H48V56H42V42H38V38H42V32C42 28.7 44.7 26 48 26H58V32H50C48.9 32 48 32.9 48 34V38H58L56 42H48Z" fill="%232874F0"/></svg>`

const RAZORPAY_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230C2340"/><path d="M38 20H58C68 20 74 25.5 74 34.5C74 41.5 69.5 46.5 62 48L76 80H60L48 52H40L30 80H16L38 20ZM44 32L39 44H56C60 44 62.5 41.5 62.5 38C62.5 34.5 60 32 56 32H44Z" fill="%230C8CE9"/><polygon points="46,54 58,80 74,80 62,54" fill="%233395FF"/></svg>`

const CRED_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230F172A"/><path d="M50 22C34.5 22 22 34.5 22 50C22 65.5 34.5 78 50 78C65.5 78 78 65.5 78 50H66C66 58.8 58.8 66 50 66C41.2 66 34 58.8 34 50C34 41.2 41.2 34 50 34C58.8 34 66 41.2 66 50H78C78 34.5 65.5 22 50 22Z" fill="white"/><circle cx="50" cy="50" r="6" fill="%2310B981"/></svg>`

const POSTMAN_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FF6C37"/><circle cx="50" cy="50" r="28" fill="white"/><path d="M40 38L64 50L40 62V38Z" fill="%23FF6C37"/></svg>`

const GOOGLE_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="white"/><path d="M50 42V58H72.5C71.5 64 66.5 74 50 74C36.7 74 26 63.3 26 50C26 36.7 36.7 26 50 26C57.6 26 62.7 29.3 65.6 32.1L75 23C69.3 17.7 60.5 14 50 14C30.1 14 14 30.1 14 50C14 69.9 30.1 86 50 86C70.8 86 84.6 71.4 84.6 50.9C84.6 47.7 84.2 44.9 83.6 42H50Z" fill="%234285F4"/></svg>`

const ZOMATO_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23E23744"/><text x="50" y="62" font-family="Arial, sans-serif" font-weight="900" font-style="italic" font-size="34" fill="white" text-anchor="middle">zomato</text></svg>`

const SWIGGY_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FC8019"/><path d="M48 24C38 24 30 32 30 42C30 54 48 76 48 76C48 76 66 54 66 42C66 32 58 24 48 24ZM48 48C44.7 48 42 45.3 42 42C42 38.7 44.7 36 48 36C51.3 36 54 38.7 54 42C54 45.3 51.3 48 48 48Z" fill="white"/></svg>`

const BRAND_LOGOS = {
  flipkart: FLIPKART_LOGO,
  razorpay: RAZORPAY_LOGO,
  postman: POSTMAN_LOGO,
  cred: CRED_LOGO,
  google: GOOGLE_LOGO,
  zomato: ZOMATO_LOGO,
  swiggy: SWIGGY_LOGO,
  jrtech: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  technova: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
  nexuscorp: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=120&auto=format&fit=crop&q=80',
}

export const getCompanyLogo = (company) => {
  if (!company) return 'https://ui-avatars.com/api/?name=Company&background=0F172A&color=ffffff&bold=true'

  const name = (typeof company === 'string' ? company : company.company_name || company.name || '').trim()
  const lowerName = name.toLowerCase()

  // Match known brand logos first
  for (const [key, logoUrl] of Object.entries(BRAND_LOGOS)) {
    if (lowerName.includes(key)) {
      return logoUrl
    }
  }

  const logo = company.logo || company.profile_picture || company.user?.profile_picture
  if (logo && typeof logo === 'string' && logo.length > 5 && (logo.startsWith('http') || logo.startsWith('data:') || logo.startsWith('/media') || logo.startsWith('/static'))) {
    if (logo.toLowerCase().includes('smartwatch') || logo.toLowerCase().includes('watch')) {
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80'
    }
    return logo
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Tech')}&background=0F172A&color=ffffff&bold=true`
}

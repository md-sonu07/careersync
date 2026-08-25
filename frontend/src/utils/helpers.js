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

export const getCompanyLogo = (company) => {
  if (!company) return 'https://ui-avatars.com/api/?name=Company&background=0D9488&color=ffffff&bold=true'
  const logo = company.logo || company.profile_picture || company.user?.profile_picture
  if (logo && typeof logo === 'string' && logo.length > 5 && (logo.startsWith('http') || logo.startsWith('data:') || logo.startsWith('/media') || logo.startsWith('/static'))) {
    return logo
  }
  const name = company.company_name || 'Company'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=ffffff&bold=true`
}

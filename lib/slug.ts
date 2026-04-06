export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateUniqueSlug(text: string): string {
  const base = generateSlug(text)
  const timestamp = Date.now().toString(36)
  return `${base}-${timestamp}`
}

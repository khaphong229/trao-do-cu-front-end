export const getDatetimeNow = () => {
  const now = new Date()
  const isoString = now.toISOString()
  return isoString
}

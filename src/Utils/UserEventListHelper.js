const formatDateToLocaleString = (eventDateStr) => {
  return new Date(eventDateStr).toLocaleString('cs', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  })
}

const formatTimeToLocaleString = (eventTimeStr) => {
  return new Date(eventTimeStr).toLocaleString('cs', {
    hour: '2-digit',
    minute: 'numeric',
  })
}

export { formatDateToLocaleString, formatTimeToLocaleString }
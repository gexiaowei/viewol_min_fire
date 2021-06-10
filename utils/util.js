const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const chunk = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  )
}

const groupBy = (array, key) => {
  return array.reduce(function (r, a) {
    r[a[key]] = r[a[key]] || []
    r[a[key]].push(a)
    return r
  }, Object.create(null))
}

module.exports = {
  formatTime,
  chunk,
  groupBy
}

export async function eachLimit (items, limit, fn) {
  Promise.all([...Array(limit)].map(async () => {
    while (items.length > 0) {
      await fn(items.pop())
    }
  }))
}

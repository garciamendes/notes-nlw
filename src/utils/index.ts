export const truncate = (value: string, { lenght }: { lenght: number}) => {
  if (value.length < lenght) {
    return value
  }

  return value.slice(0, lenght) + '...'
}
export function dayKeyLoad(date = new Date()): string {
  const formattedDate: string = date.toLocaleDateString();
  return formattedDate
  // TODO: changer date pour internationale
}

export function cn(...inputs: any[]): string {
  return inputs
    .flat(Infinity)
    .filter((x) => typeof x === 'string' && x.length > 0)
    .join(' ');
}

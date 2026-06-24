/** Generate a public case reference like LA-7F3K9Q (6 chars, no ambiguous 0/O/1/I). */
export function generateReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LA-${code}`;
}

export async function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const binary = new Uint8Array(hashBuffer);
  const base64 = btoa(String.fromCharCode(...binary));
  return base64;
}
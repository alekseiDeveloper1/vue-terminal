self.onmessage = async (
  event: MessageEvent<{ queryString: string; secretKey: string }>,
) => {
  const { queryString, secretKey } = event.data

  const encoder = new TextEncoder()
  const key = await self.crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await self.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(queryString),
  )

  const hashArray = Array.from(new Uint8Array(signature))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  self.postMessage(hashHex)
}

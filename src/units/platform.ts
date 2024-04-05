const ua = typeof window === 'object' ? window.navigator.userAgent : ''

export const  isIOS = /iPhone|iPod|iPad/i.test(ua)
export const  isAndroid = /Android/i.test(ua)

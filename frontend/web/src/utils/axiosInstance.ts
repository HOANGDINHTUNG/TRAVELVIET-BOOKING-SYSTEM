import axios from 'axios'

const rawBaseUrl = String(
  import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    'http://localhost:8088/api/v1',
)

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')

const authTokenKeys = [
  'travelviet-auth-token',
  'auth-token',
  'token',
] as const

function readStoredAccessToken() {
  for (const key of authTokenKeys) {
    const token =
      window.sessionStorage.getItem(key) || window.localStorage.getItem(key)

    if (token) {
      return token
    }
  }

  return null
}

export const axiosBackend = axios.create({
  baseURL: `${API_BASE_URL}/`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosBackend.interceptors.request.use((config) => {
  const token = readStoredAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

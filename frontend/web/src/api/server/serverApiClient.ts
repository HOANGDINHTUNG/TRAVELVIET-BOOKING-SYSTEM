import { axiosBackend } from '../../utils/axiosInstance'
import type { ApiRequestOptions } from '../../types/api'
import { ApiClientError } from '../../types/api'
import { handleApiError } from '../../lib/handleApiError'

export type BackendRequestParams = Record<string, unknown>

type BackendRequestConfig = {
  params?: BackendRequestParams
  options?: ApiRequestOptions
}

async function requestBackendData<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  body?: unknown,
  config: BackendRequestConfig = {},
) {
  const fallback = `Could not load data from ${path}.`

  try {
    const response = await axiosBackend.request<T>({
      method,
      url: path,
      data: body,
      params: config.params,
    })

    if (
      config.options?.allowEmpty &&
      (response.status === 204 || response.data == null)
    ) {
      return undefined as T
    }

    return response.data as T
  } catch (error: unknown) {
    if (error instanceof ApiClientError) throw error
    throw new Error(handleApiError(error, fallback))
  }
}

export async function getBackendData<T>(
  path: string,
  params?: BackendRequestParams,
) {
  return requestBackendData<T>('get', path, undefined, { params })
}

export function postBackendData<T>(path: string, body?: unknown, config?: BackendRequestConfig) {
  return requestBackendData<T>('post', path, body, config)
}

export function putBackendData<T>(path: string, body?: unknown, config?: BackendRequestConfig) {
  return requestBackendData<T>('put', path, body, config)
}

export function patchBackendData<T>(path: string, body?: unknown, config?: BackendRequestConfig) {
  return requestBackendData<T>('patch', path, body, config)
}

export function deleteBackendData<T = void>(path: string, config?: BackendRequestConfig) {
  return requestBackendData<T>('delete', path, undefined, {
    ...config,
    options: { allowEmpty: true, ...config?.options },
  })
}

export const backendApiClient = {
  get: getBackendData,
  post: postBackendData,
  put: putBackendData,
  patch: patchBackendData,
  delete: deleteBackendData,
}

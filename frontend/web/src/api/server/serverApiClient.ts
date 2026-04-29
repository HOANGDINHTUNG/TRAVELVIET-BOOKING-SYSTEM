import { axiosBackend } from '../../utils/axiosInstance'
import type { ApiRequestOptions, ApiResponse } from '../../types/api'
import { unwrapApiResponse } from '../../types/api'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

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
  const fallback = `Khong the tai du lieu tu ${path}.`

  try {
    const response = await axiosBackend.request<ApiResponse<T>>({
      method,
      url: path,
      data: body,
      params: config.params,
    })

    return unwrapApiResponse(response.data, fallback, config.options) as T
  } catch (error) {
    throw new Error(getApiErrorMessage(error, fallback))
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

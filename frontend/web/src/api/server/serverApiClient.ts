import { axiosBackend } from '../../utils/axiosInstance'
import type { ApiResponse } from '../../types/api'
import { unwrapApiResponse } from '../../types/api'
import { getApiErrorMessage } from '../../utils/getApiErrorMessage'

export async function getBackendData<T>(
  path: string,
  params?: Record<string, unknown>,
) {
  try {
    const response = await axiosBackend.get<ApiResponse<T>>(path, { params })

    return unwrapApiResponse(response.data, `Khong the tai du lieu tu ${path}.`)
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, `Khong the tai du lieu tu ${path}.`),
    )
  }
}

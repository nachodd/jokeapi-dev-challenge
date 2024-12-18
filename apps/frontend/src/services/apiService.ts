import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  get(resource: string, params?: any) {
    return apiClient.get(resource, { params })
  },
  post(resource: string, data: any) {
    return apiClient.post(resource, data)
  },
  put(resource: string, data: any) {
    return apiClient.put(resource, data)
  },
  delete(resource: string) {
    return apiClient.delete(resource)
  }
}

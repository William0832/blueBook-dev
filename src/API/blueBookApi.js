import axios from 'axios'

const api = axios.create({
  baseURL: 'https://bluebook.fcop.io/bluebook'
})

// api.interceptors.request.use(config => config)

api.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const { data, headers } = response
      if (!data.success) {
        const err = new Error(data.message)
        err.data = data.data
        throw err
      }
      return data.data
    }
    if (!response.data.success) {
      return Promise.reject(response.data.message)
    }
  },
  err => {
    if (err?.isAxiosError && err?.response) {
      const { status, data } = err.response
      const errPayload = {
        data,
        status,
        message: data?.message || ''
      }
      return Promise.reject(errPayload)
    }
    return Promise.reject(err)
  }
)

export async function getCategories () {
  try {
    const data = await api('/objects')
    return data
  } catch (err) {
    console.warn(err)
  }
}

export async function getProjectList () {
  try {
    const data = await api('/projects')
    return data
  } catch (err) {
    console.warn(err)
  }
}

export async function getBlueprints ({ pId, bpId }) {
  try {
    if (pId === '' || pId == null) {
      throw new Error('empty pId')
    } if (bpId === '' || bpId == null) {
      throw new Error('empty bId')
    }
    const data = await api(`projects/${pId}/blueprints/${bpId}`)
    return data
  } catch (err) {
    console.warn(err)
  }
}

export async function addBlueprint ({ pId, bpId }) {
  try {
    if (pId === '' || pId == null) {
      throw new Error('empty pId')
    } if (bpId === '' || bpId == null) {
      throw new Error('empty bpId')
    }
    const data = await api.post(`projects/${pId}/blueprints/${bpId}/addTab`)
    return data
  } catch (err) {
    console.warn(err)

  }
}

export async function updateBlueprint ({ pId, bpId, tabId, title, content }) {
  try {
    if (pId === '' || pId == null) {
      throw new Error('empty pId')
    }
    if (bpId === '' || bpId == null) {
      throw new Error('empty bpId')
    }
    if (tabId === '' || tabId == null) {
      throw new Error('empty tabId')
    }
    const data = await api.put(`projects/${pId}/blueprints/${bpId}/tabs/${tabId}`, {
      tabTitle: title,
      tabContent: JSON.stringify(content)
    })
    return data
  } catch (err) {
    console.warn(err)

  }
}

export default api

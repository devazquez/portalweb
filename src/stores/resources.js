import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchOmekaResources, fetchCMSContent, searchResources } from '../api'

export const useResourceStore = defineStore('resources', () => {
  const omekaResources = ref([])
  const cmsContent = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedFilters = ref({})

  const filteredResources = computed(() => {
    // Combinar recursos de Omeka y CMS
    let results = [
      ...omekaResources.value,
      ...cmsContent.value
    ]

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      results = results.filter(r => 
        r.title?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.body?.toLowerCase().includes(query)
      )
    }

    Object.keys(selectedFilters.value).forEach(key => {
      if (selectedFilters.value[key].length > 0) {
        results = results.filter(r => 
          selectedFilters.value[key].includes(r[key])
        )
      }
    })

    return results
  })

  async function loadResources() {
    loading.value = true
    error.value = null
    try {
      const [omeka, cms] = await Promise.all([
        fetchOmekaResources(),
        fetchCMSContent()
      ])
      omekaResources.value = omeka
      cmsContent.value = cms
    } catch (err) {
      error.value = err.message || 'Error al cargar los recursos'
      console.error('Error loading resources:', err)
    } finally {
      loading.value = false
    }
  }

  async function search(query, source = 'all') {
    searchQuery.value = query
    loading.value = true
    error.value = null
    try {
      const results = await searchResources(query, source)
      omekaResources.value = results
    } catch (err) {
      error.value = err.message || 'Error en la búsqueda'
      console.error('Search error:', err)
    } finally {
      loading.value = false
    }
  }

  function setFilters(filters) {
    selectedFilters.value = filters
  }

  function clearFilters() {
    selectedFilters.value = {}
    searchQuery.value = ''
  }

  return {
    omekaResources,
    cmsContent,
    loading,
    error,
    searchQuery,
    selectedFilters,
    filteredResources,
    loadResources,
    search,
    setFilters,
    clearFilters
  }
})

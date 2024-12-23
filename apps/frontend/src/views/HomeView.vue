<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
import { InfoIcon } from 'lucide-vue-next'

import JokesTable from '@/components/JokesTable.vue';
import JokeForm from '@/components/JokeForm.vue'
import JokeService from '@/services/JokeService'
import { useJokes } from '@/composables/useJokes'

import type { Joke, JokeType } from '@/types/JokeTypes.d'

type JokeModalMode = 'create' | 'edit' | ''

// State management
const activeTab = ref('server')
const isServerSide = computed(() => activeTab.value === 'server')
const jokesComposable = useJokes(isServerSide.value)

// Watchers
watch(() => activeTab.value, () => {
  jokesComposable.setServerSide(isServerSide.value)
  // Check if the page is different from 1. If so, reset the page to 1
  let pageChanged = false
  if (jokesComposable.currentPage.value !== 1) {
    jokesComposable.updatePage(1)
    pageChanged = true
  }

  // If page have change, the below watcher will fetch the jokes.
  // if not, we need to fetch the jokes manually.
  // If not server side, we need to fetch the jokes manually too.
  if (!isServerSide.value) {
    jokesComposable.fetchJokes(true)
  } else if (isServerSide.value && !pageChanged){
    jokesComposable.fetchJokes()
  }
})

watch([jokesComposable.sortBy, jokesComposable.sortOrder, jokesComposable.currentPage], () => {
  if (isServerSide.value) {
    jokesComposable.fetchJokes()
  } else {
    jokesComposable.updateLocalJokes()
  }
})

// Fetch joke types on mount
const jokesTypes: Ref<JokeType> = ref([])

onMounted(async () => {
  jokesTypes.value = await JokeService.getTypes()
  jokesComposable.fetchJokes(true)
})

// Modal state management
const showConfirmDeleteModal = ref(false)
const showModal = ref(false)
const mode = ref<JokeModalMode>('')
const jokeEditDelete = ref<Joke | null>(null)

// Modal handlers
const openDeleteModal = (joke: Joke) => {
  jokeEditDelete.value = joke
  showConfirmDeleteModal.value = true
}
const closeDeleteModal = () => {
  jokeEditDelete.value = null
  showConfirmDeleteModal.value = false
}
const openEditCreateModal = (openInMode: JokeModalMode, jokeToEdit?: Joke) => {
  mode.value = openInMode
  jokeEditDelete.value = jokeToEdit || null
  showModal.value = true
}
const closeCreateEditModal = () => {
  showModal.value = false
  jokeEditDelete.value = null
  mode.value = ''
}

// Handle form submission
const handleFormSubmit = async (values: { type: string, setup: string, punchline: string }) => {
  const joke: Joke = {
    id: mode.value === 'edit' ? (jokeEditDelete.value?.id || 0) : 0,
    type: values.type,
    setup: values.setup,
    punchline: values.punchline
  }

  try {
    if (mode.value === 'create') {
      handleFormCreateSubmission(joke)
    }
    else {
      handleFormEditSubmission(joke)
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      variant: 'destructive',
      description: `An error occurred while ${mode.value === 'edit' ? 'updating' : 'adding'} the joke: ${error?.message}`,
    })
  }

  closeCreateEditModal()
}

// Handle joke creation
const handleFormCreateSubmission = async (joke: Joke) => {
  if (activeTab.value === 'local') {
    joke.id = jokesComposable.allJokes.value.length + 1
    jokesComposable.addLocalJoke(joke)
  } else {
    await JokeService.addJoke(joke)
    jokesComposable.fetchJokes()
  }
  toast({
    title: 'Creation Successful',
    variant: 'default',
    description: 'Joke added successfully!',
  })
}

// Handle joke editing
const handleFormEditSubmission = async (joke: Joke) => {
  if (activeTab.value === 'local') {
    jokesComposable.editLocalJoke(joke)
  } else {
    await JokeService.updateJoke(joke)
    jokesComposable.fetchJokes()
  }
  toast({
    title: 'Edition successful',
    variant: 'default',
    description: 'Joke updated successfully!',
  })
}

// Handle joke deletion
const handleDeleteJoke = async () => {
  try {
    if (activeTab.value === 'local') {
      jokesComposable.deleteLocalJoke(jokeEditDelete.value?.id || 0)
    } else {
      await JokeService.deleteJoke(jokeEditDelete.value?.id || -1)
      jokesComposable.fetchJokes()
    }

    toast({
      title: 'Deletion successful',
      variant: 'default',
      description: 'Joke deleted successfully!',
    })
  } catch (error: any) {
    toast({
      title: 'Error',
      variant: 'destructive',
      description: `An error occurred while deleting the joke: ${error?.message}`,
    })
  }

  closeDeleteModal()
}

</script>

<template>
  <main class="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <Toaster />
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold text-center">Joke API Demo</h1>

      <!-- Add/Edit Joke Dialog -->
      <Dialog :open="showModal" @update:open="showModal = $event">
        <DialogTrigger as-child>
          <Button @click="openEditCreateModal('create')">Add New Joke</Button>
        </DialogTrigger>
        <DialogContent v-if="showModal">
          <DialogHeader>
            <DialogTitle>{{ mode==="create" ? 'Add New Joke' : 'Edit Joke' }}</DialogTitle>
            <DialogDescription>{{ mode==="create" ? 'Fill out the form below to add a new joke.': 'Edit the information of the Joke'}}</DialogDescription>
          </DialogHeader>
          <JokeForm :mode="mode" :joke-edit="jokeEditDelete" :jokeTypes="jokesTypes" @submit="handleFormSubmit" />
          <DialogFooter>
            <Button variant="outline" @click="closeCreateEditModal">Close</Button>
            <Button form="jokeForm" type="submit">{{ mode==="create" ? 'Add' : 'Edit' }}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Delete Joke Confirmation Dialog -->
      <AlertDialog :open="showConfirmDeleteModal">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {{
                activeTab === 'local'
                  ? 'This action will only delete the joke from the local list.'
                  : `This action cannot be undone. This will permanently delete the Joke with ID: ${jokeEditDelete?.id}`
              }}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel @click="closeDeleteModal">Cancel</AlertDialogCancel>
            <AlertDialogAction @click="handleDeleteJoke">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <!-- Tabs for Server/Local operations -->
    <div class="flex justify-center mt-8">
      <Tabs default-value="server" class="w-full" v-model="activeTab">
        <TabsList class="grid w-full grid-cols-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TabsTrigger value="server" class="w-full">
                  <div class="flex flex-row gap-2 items-center">Server Side operations <InfoIcon class="w-4 h-4" /></div>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent class="max-w-xs">
                <p>
                  The <strong>Sorting</strong> and <strong>Pagination</strong> will be done <strong>on the Server</strong>. This means that the data will be fetched from the server <strong>every time</strong> you sort or paginate.
                </p>
                <p>
                  Also, creation, edition, and deletion <strong>will be persisted on the server.</strong>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TabsTrigger value="local" class="w-full">
                  <div class="flex flex-row gap-2 items-center">Local operations <InfoIcon class="w-4 h-4" /></div>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent class="max-w-xs">
                <p>
                  The <strong>Sorting</strong> and <strong>Pagination</strong> will be done <strong>on the Client</strong>. This means that the data will be fetched from the server <strong>only once</strong>.
                </p>
                <p>
                  Also, creation, edition, and deletion <strong>won't be persisted on the server.</strong>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


        </TabsList>
        <TabsContent value="server" class="mt-8">
          <JokesTable model="server" @edit="(joke) => openEditCreateModal('edit', joke)" @delete="openDeleteModal"  />
        </TabsContent>
        <TabsContent value="local">
          <JokesTable model="local"  @edit="(joke) => openEditCreateModal('edit', joke)" @delete="openDeleteModal" />
        </TabsContent>
      </Tabs>
    </div>
  </main>
</template>

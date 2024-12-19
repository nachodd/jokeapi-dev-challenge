<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
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
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import JokesTable from '@/components/JokesTable.vue';
import JokeForm from '@/components/JokeForm.vue'
import JokeService from '@/services/JokeService'
import { useJokes } from '@/composables/useJokes'

import type { Joke, JokeType } from '@/types/JokeTypes.d'

type JokeModalMode = 'create' | 'edit' | ''

const activeTab = ref('server')

const jokesTypes: Ref<JokeType> = ref([])
onMounted(async () => {
  jokesTypes.value = await JokeService.getTypes()

  const { fetchJokes } = useJokes()
  fetchJokes(true)
})


const showModal = ref(false)
const mode = ref<JokeModalMode>('')
const jokeEdit = ref<Joke | null>(null)
const openModal = (openInMode: JokeModalMode, jokeToEdit?: Joke) => {
  mode.value = openInMode
  jokeEdit.value = jokeToEdit || null
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  mode.value = ''
}
const handleFormSubmit = async (values: { type: string, setup: string, punchline: string }) => {
  const joke: Joke = {
    id: mode.value === 'edit' ? (jokeEdit.value?.id || 0) : 0,
    type: values.type,
    setup: values.setup,
    punchline: values.punchline
  }

  try {
    if (mode.value === 'edit') {
      await JokeService.updateJoke(joke)
      toast({
        title: 'Edition successful',
        variant: 'default',
        description: 'Joke updated successfully!',
      })
    } else {
      const newJoke = await JokeService.addJoke(joke)
      toast({
        title: 'Creation Successful',
        variant: 'default',
        description: 'Joke added successfully!',
      })
      if (activeTab.value === 'local') {
        const { addLocalJoke } = useJokes()
        addLocalJoke(newJoke)
      } else {
        const { fetchJokes } = useJokes(true)
        fetchJokes()
      }
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      variant: 'destructive',
      description: `An error occurred while ${mode.value === 'edit' ? 'updating' : 'adding'} the joke: ${error?.message}`,
    })
  }

  if (mode.value === 'edit' && activeTab.value === 'local') {
    const { editLocalJoke } = useJokes()
    editLocalJoke(joke)
  } else if (mode.value === 'edit') {
    const { fetchJokes } = useJokes(true)
    fetchJokes()
  }

  closeModal()
}


</script>

<template>
  <main class="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <Toaster />
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold text-center">Joke API Demo</h1>

      <Dialog :open="showModal">
        <DialogTrigger as-child>
          <Button @click="openModal('create')">Add New Joke</Button>
        </DialogTrigger>
        <DialogContent v-if="showModal">
          <DialogHeader>
            <DialogTitle>{{ mode==="create" ? 'Add New Joke' : 'Edit Joke' }}</DialogTitle>
            <DialogDescription>{{ mode==="create" ? 'Fill out the form below to add a new joke.': 'Edit the information of the Joke'}}</DialogDescription>
          </DialogHeader>
          <JokeForm :mode="mode" :joke-edit="jokeEdit" :jokeTypes="jokesTypes" @submit="handleFormSubmit" />
          <DialogFooter>
            <Button variant="outline" @click="closeModal">Close</Button>
            <Button form="jokeForm" type="submit">{{ mode==="create" ? 'Add' : 'Edit' }}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="flex justify-center mt-8">
      <Tabs default-value="server" class="w-full" v-model="activeTab">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="server">
            Server Side operations
          </TabsTrigger>
          <TabsTrigger value="local">
            Local operations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="server" class="mt-8">
          <JokesTable model="server" @edit="(joke) => openModal('edit', joke)" />
        </TabsContent>
        <TabsContent value="local">
          <JokesTable model="local"  @edit="(joke) => openModal('edit', joke)"/>
        </TabsContent>
      </Tabs>
    </div>
  </main>
</template>

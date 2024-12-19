<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import type { Joke, JokeType } from '@/types/JokeTypes.d'

const props = withDefaults(defineProps<{
  jokeTypes: JokeType,
  jokeEdit: Joke | null,
  mode: 'create' | 'edit' | ''
}>(), {
  mode: 'create'
})

const emit = defineEmits(['submit'])

const formSchema = toTypedSchema(z.object({
  type: z.string().nonempty(),
  setup: z.string().nonempty(),
  punchline: z.string().nonempty()
}))

let form;
let onSubmit: any;


watch(() => props.mode, () => {
  if (props.mode === 'create') {
    form = useForm({
      validationSchema: formSchema,
    })
    onSubmit = form.handleSubmit(values => {
      emit('submit', values)
    })
  } else {
    form = useForm({
      validationSchema: formSchema,
      initialValues: {
        type: props.jokeEdit?.type,
        setup: props.jokeEdit?.setup,
        punchline: props.jokeEdit?.punchline
      }
    })
    onSubmit = form.handleSubmit(values => {
      emit('submit', values)
    })
  }
}, { immediate: true })



</script>

<template>
  <form id="jokeForm" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="type">
      <FormItem class="mb-4">
        <FormLabel>Type</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger>
              <SelectValue placeholder="Select a Joke Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="type in props.jokeTypes" :value="type" :key="type">
                  {{ type }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="setup">
      <FormItem class="mb-4">
        <FormLabel>Setup</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Setup of the Joke" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="punchline">
      <FormItem class="mb-4">
        <FormLabel>Punchline</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your punchline goes here" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>

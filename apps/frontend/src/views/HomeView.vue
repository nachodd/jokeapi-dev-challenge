<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import JokesTable from '@/components/JokesTable.vue';

</script>

<template>
  <main class="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-center">Joke API Demo</h1>

    <div class="flex justify-center mt-8">
      <Tabs default-value="server" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="server">
            Server Side operations
          </TabsTrigger>
          <TabsTrigger value="local">
            Local operations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="server" class="mt-8">
          <JokesTable model="server" />
        </TabsContent>
        <TabsContent value="local">
          <JokesTable model="local" />
        </TabsContent>
      </Tabs>
    </div>


  </main>
</template>

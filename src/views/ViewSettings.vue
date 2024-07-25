<script setup lang="ts">
import { useMetaStore } from '@/stores/meta';

useMetaStore().title = '@:view.settings.title';
</script>

<template>
    <main>This is the settings.</main>
</template>

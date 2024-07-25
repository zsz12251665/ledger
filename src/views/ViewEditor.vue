<script setup lang="ts">
import { useFileSystemStore } from '@/stores/fileSystem';
import { useMetaStore } from '@/stores/meta';
import { NCard, NInput } from 'naive-ui';

useMetaStore().title = '@:view.editor.title';

const fs = useFileSystemStore();
</script>

<template>
    <NCard>
        <NInput type="textarea" autosize v-model:value="fs.text" />
    </NCard>
</template>

<style scoped>
.n-input {
    font-family: monospace;
}
</style>

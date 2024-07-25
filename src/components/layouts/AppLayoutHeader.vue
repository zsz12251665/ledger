<script setup lang="ts">
import LocaleDropdown from '@/components/LocaleDropdown.vue';
import { useMetaStore } from '@/stores/meta';
import { NLayoutHeader, NPageHeader } from 'naive-ui';
import { storeToRefs } from 'pinia';

const { title } = storeToRefs(useMetaStore());
</script>

<template>
    <NLayoutHeader bordered>
        <NPageHeader :title="title">
            <template #extra>
                <LocaleDropdown />
            </template>
        </NPageHeader>
    </NLayoutHeader>
</template>

<style scoped>
.n-layout-header {
    padding: 1em;
}
</style>

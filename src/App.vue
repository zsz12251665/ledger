<script setup lang="ts">
import AppLayoutHeader from '@/components/layouts/AppLayoutHeader.vue';
import AppLayoutSidebar from '@/components/layouts/AppLayoutSidebar.vue';
import { darkTheme, lightTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutContent, useOsTheme } from 'naive-ui';
import { RouterView } from 'vue-router';
import { computed } from 'vue';

const osThemeRef = useOsTheme();
const theme = computed(() =>
    osThemeRef.value === 'dark' ? darkTheme : osThemeRef.value === 'light' ? lightTheme : null,
);
</script>

<template>
    <NConfigProvider abstract :theme="theme">
        <NLayout position="absolute" has-sider>
            <AppLayoutSidebar />
            <NLayout>
                <AppLayoutHeader />
                <NLayoutContent content-style="padding: 1em;">
                    <RouterView />
                </NLayoutContent>
            </NLayout>
        </NLayout>
        <NGlobalStyle />
    </NConfigProvider>
</template>

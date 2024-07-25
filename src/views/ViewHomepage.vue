<script setup lang="ts">
import { useFileSystemStore } from '@/stores/fileSystem';
import { useMetaStore } from '@/stores/meta';
import { NButton, NCard, NFlex, NResult } from 'naive-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const fs = useFileSystemStore();

useMetaStore().title = '@:view.homepage.title';

const resultStatus = computed(() => {
    if (fs.status === 'notSupported') return 'error';
    else if (fs.status === 'notOpened') return 'info';
    // (fs.status === 'ready')
    else return 'success';
});
</script>

<template>
    <NCard size="huge">
        <NResult :status="resultStatus" :title="t(`view.homepage.status.${fs.status}`, { filename: fs.fileName })">
            <template #footer>
                <NFlex justify="center" size="large">
                    <NButton :disabled="fs.status === 'notSupported'" @click="fs.open()">
                        {{ t('view.homepage.button.openFile') }}
                    </NButton>
                    <NButton :disabled="fs.status === 'notSupported'" @click="fs.create()">
                        {{ t('view.homepage.button.createFile') }}
                    </NButton>
                </NFlex>
            </template>
        </NResult>
    </NCard>
</template>

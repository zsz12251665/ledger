import { useFileSystemAccess } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export type FileSystemStatus = 'notSupported' | 'notOpened' | 'ready';

export const useFileSystemStore = defineStore('fileSystem', () => {
    const fs = useFileSystemAccess({
        dataType: 'Text',
    });
    const { isSupported, file, fileName, data } = fs;
    const status = computed<FileSystemStatus>(() => {
        if (!isSupported.value) return 'notSupported';
        if (!file.value) return 'notOpened';
        return 'ready';
    });
    const open = fs.open.bind(fs);
    const create = fs.create.bind(fs);
    const save = fs.save.bind(fs);
    return { status, file, fileName, text: data, open, create, save };
});

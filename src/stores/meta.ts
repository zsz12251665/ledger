import { useTitle } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useMetaStore = defineStore('meta', () => {
    const { rt } = useI18n();

    const titleMessageRef = ref('Naive Ledger');
    const title = computed({
        get: () => rt(titleMessageRef.value),
        set: (value) => {
            titleMessageRef.value = value;
        },
    });
    useTitle(title);

    return { title };
});

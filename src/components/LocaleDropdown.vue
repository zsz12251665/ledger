<script setup lang="ts">
import { TranslateFilled } from '@vicons/material';
import { NButton, NDropdown, NIcon, type DropdownOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { availableLocales, locale, t } = useI18n();

const localeOptions = availableLocales.map(
    (availableLocale): DropdownOption => ({
        key: availableLocale,
        label: t(`locale.${availableLocale}`, [], { locale: availableLocale }),
    }),
);

function changeLocale(targetLocale: string) {
    locale.value = targetLocale;
}
</script>

<template>
    <NDropdown :options="localeOptions" :on-select="changeLocale">
        <NButton quaternary circle>
            <template #icon>
                <NIcon :component="TranslateFilled" />
            </template>
        </NButton>
    </NDropdown>
</template>

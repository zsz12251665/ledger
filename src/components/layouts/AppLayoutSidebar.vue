<script lang="ts" setup>
import {
    AccountBalanceWalletFilled,
    AccountTreeRound,
    EditRound,
    FormatListBulletedRound,
    HomeRound,
    LiveHelpRound,
    SettingsRound,
    ShowChartRound,
} from '@vicons/material';
import { NIcon, NLayoutSider, NMenu, type MenuOption } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

function renderLabel(routeName: string) {
    return () => h(RouterLink, { to: { name: routeName } }, { default: () => t(`view.${routeName}.title`) });
}

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const collapsed = ref(false);

const menuOptions: MenuOption[] = [
    {
        key: 'homepage',
        label: renderLabel('homepage'),
        icon: renderIcon(HomeRound),
    },
    {
        key: 'income-statement',
        label: renderLabel('income-statement'),
        icon: renderIcon(ShowChartRound),
    },
    {
        key: 'balance-sheet',
        label: renderLabel('balance-sheet'),
        icon: renderIcon(AccountBalanceWalletFilled),
    },
    {
        key: 'trial-balance',
        label: renderLabel('trial-balance'),
        icon: renderIcon(AccountTreeRound),
    },
    {
        key: 'journal',
        label: renderLabel('journal'),
        icon: renderIcon(FormatListBulletedRound),
    },
    {
        key: 'editor',
        label: renderLabel('editor'),
        icon: renderIcon(EditRound),
    },
    {
        key: 'settings',
        label: renderLabel('settings'),
        icon: renderIcon(SettingsRound),
    },
    {
        key: 'help',
        label: renderLabel('help'),
        icon: renderIcon(LiveHelpRound),
    },
];
</script>

<template>
    <NLayoutSider
        bordered
        show-trigger
        content-style="padding: 0.5em 0;"
        collapse-mode="width"
        :collapsed-width="56"
        v-model:collapsed="collapsed"
    >
        <NMenu
            :icon-size="24"
            :collapsed-width="56"
            :options="menuOptions"
            :collapsed="collapsed"
            :value="String(route.name)"
        />
    </NLayoutSider>
</template>

<style scoped>
.n-menu :deep(.n-menu-item-content) {
    line-height: 24px;
}
</style>

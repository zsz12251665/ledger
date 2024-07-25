import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'homepage',
            component: () => import('@/views/ViewHomepage.vue'),
        },
        {
            path: '/income-statement',
            name: 'income-statement',
            component: () => import('@/views/ViewIncomeStatement.vue'),
        },
        {
            path: '/balance-sheet',
            name: 'balance-sheet',
            component: () => import('@/views/ViewBalanceSheet.vue'),
        },
        {
            path: '/trial-balance',
            name: 'trial-balance',
            component: () => import('@/views/ViewTrialBalance.vue'),
        },
        {
            path: '/trial-balance',
            name: 'trial-balance',
            component: () => import('@/views/ViewTrialBalance.vue'),
        },
        {
            path: '/journal',
            name: 'journal',
            component: () => import('@/views/ViewJournal.vue'),
        },
        {
            path: '/details',
            name: 'details',
            component: () => import('@/views/ViewDetails.vue'),
        },
        {
            path: '/editor',
            name: 'editor',
            component: () => import('@/views/ViewEditor.vue'),
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/views/ViewSettings.vue'),
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('@/views/ViewHelp.vue'),
        },
    ],
});

export default router;

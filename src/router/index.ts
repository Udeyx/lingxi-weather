import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import PersonView from '@/views/PersonView.vue'
import WarnView from '@/views/WarnView.vue'
import FeedbackView from '@/views/FeedbackView.vue'
import HomeView from '@/views/HomeView.vue'
import WeatherView from '@/views/WeatherView.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import LandscapeView from '@/views/LandscapeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/welcome',
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: 'welcome',
                    name: 'welcome',
                    component: WelcomeView
                },
                {
                    path: 'analysis',
                    name: 'analysis',
                    component: AnalysisView
                },
                {
                    path: 'weather',
                    name: 'weather',
                    component: WeatherView
                },
                {
                    path: 'landscape',
                    name: 'landscape',
                    component: LandscapeView
                },
                {
                    path: 'feedback',
                    name: 'feedback',
                    component: FeedbackView
                },
                {
                    path: 'warn',
                    name: 'warn',
                    component: WarnView
                },
                {
                    path: 'person',
                    name: 'person',
                    component: PersonView
                }
            ]
        }
    ]
})

export default router

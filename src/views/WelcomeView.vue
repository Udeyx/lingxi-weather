<script lang="ts" setup>
import { ref } from 'vue'
import cities from '@/assets/cities.json'
import { useRouter } from 'vue-router'
import type { LoginForm } from '@/types/welcome'
import { login, register } from '@/api'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'

const toast = useToast()

const showSuccess = () => {
    toast.add({
        severity: 'success',
        summary: '登录成功',
        detail: '登录成功',
        life: 30000000
    })
}

const showError = () => {
    toast.add({
        severity: 'error',
        summary: '登录失败',
        detail: '用户名或密码错误',
        life: 3000000
    })
}

const router = useRouter()
const form = ref<LoginForm>({
    phone: '',
    password: '',
    username: '',
    locId: 0
})
const formType = ref<'Login' | 'Register'>('Login')
const isLoading = ref(false)
const handleRegister = async () => {
    formType.value = 'Login'
    isLoading.value = true
    const res = await register(form.value)
    if (res.status === 200) {
        formType.value = 'Register'
    }
    isLoading.value = false
}
const handleLogin = async () => {
    isLoading.value = true
    const res = await login(form.value)
    if (res.status === 200) {
        localStorage.setItem('token', res.data.access)
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('area', res.data.default_area)
        localStorage.setItem('avatar', res.data.avatar || '/files/default_avatar.png')
        localStorage.setItem('phone', form.value.phone)
        localStorage.setItem('locId', res.data.default_area)
        showSuccess()
        setTimeout(() => {
            // 在这里写你想延迟执行的代码
            router.push({ name: 'home' })
        }, 500) // 3000 毫秒 = 3 秒
    } else {
        showError()
    }
    isLoading.value = false
}
</script>

<template>
    <main class="flex h-screen w-screen items-center justify-center bg-[url('@/assets/bg.webp')]">
        <Toast />
        <Card class="bg-slate-300/10 backdrop-blur-md">
            <template #title>
                <h1 class="text-center text-3xl text-sky-500">灵犀气象</h1>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-mobile" />
                        </InputGroupAddon>
                        <InputText v-model="form.phone" placeholder="请输入手机号" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock" />
                        </InputGroupAddon>
                        <Password v-model="form.password" placeholder="请输入密码" toggle-mask />
                    </InputGroup>
                    <InputGroup v-if="formType == 'Register'">
                        <InputGroupAddon>
                            <i class="pi pi-user" />
                        </InputGroupAddon>
                        <InputText v-model="form.username" placeholder="请输入用户名" />
                    </InputGroup>
                    <InputGroup v-if="formType == 'Register'">
                        <InputGroupAddon>
                            <i class="pi pi-map-marker" />
                        </InputGroupAddon>
                        <Dropdown
                            v-model="form.locId"
                            :options="cities"
                            option-label="name"
                            option-value="locId"
                            placeholder="请输入所在地"
                            editable
                        />
                    </InputGroup>
                    <button
                        class="self-end text-sm text-blue-600 underline"
                        @click="formType = formType == 'Login' ? 'Register' : 'Login'"
                    >
                        {{ formType == 'Login' ? '注册' : '登录' }}
                    </button>
                    <Button
                        :loading="isLoading"
                        :label="formType == 'Login' ? '登录' : '注册'"
                        @click="
                            () => {
                                if (formType == 'Login') {
                                    handleLogin()
                                } else {
                                    handleRegister()
                                }
                            }
                        "
                    />
                </div>
            </template>
        </Card>
    </main>
</template>

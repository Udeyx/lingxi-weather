<script lang="ts" setup>
import cities from '@/assets/cities.json'
import type { PersonProfile } from '@/types/person'
import { onMounted, ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload'
import axios from 'axios'
import { getSubscriptions, getWarning, staticHostUrl, subscribe, updateInfo } from '@/api'
const toast = useToast()

const profile = ref<PersonProfile>({
    phone: '',
    avatar: '',
    password: '',
    username: '',
    locId: +(localStorage.getItem('locId') ?? 114514),
    subCities: []
})
const modifyTarget = ref<'profile' | 'subscription'>('profile')
const options = ref([
    { name: '基本信息', value: 'profile' },
    { name: '灾害订阅', value: 'subscription' }
])

const handleSubmit = async () => {
    toast.add({
        severity: 'success',
        summary: '修改成功',
        life: 3000
    })
    if (modifyTarget.value === 'profile') {
        await updateInfo(
            Object.fromEntries(Object.entries(profile.value).filter(([k, v]) => v !== ''))
        )
    } else {
        await subscribe(profile.value.subCities)
    }
    const res = await getWarning()
    if (res.status === 200) {
        toast.add({
            severity: 'warn',
            summary: res.data.msg,
            life: 4000
        })
    }
}
const customUploader = async (event: FileUploadUploaderEvent) => {
    const file = Array.isArray(event.files) ? event.files[0] : event.files
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await axios.post(staticHostUrl + '/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        profile.value.avatar = res.data.url
        localStorage.setItem('avatar', profile.value.avatar)
    } catch (error) {
        console.error('上传失败:', error)
    }
}
onMounted(async () => {
    profile.value.avatar = localStorage.getItem('avatar') ?? '/files/default_avatar.png'
    profile.value.phone = localStorage.getItem('phone') ?? '33344445555'
    profile.value.username = localStorage.getItem('username') ?? 'user1'
    const res = await getSubscriptions()
    if (res.status === 200) {
        console.log(res.data)
        profile.value.subCities = res.data
    }
})
</script>

<template>
    <Toast />
    <main class="flex h-full flex-col items-center justify-center gap-2">
        <SelectButton
            v-model="modifyTarget"
            :options="options"
            option-label="name"
            option-value="value"
        />
        <div class="flex flex-col items-center gap-2">
            <div v-if="modifyTarget === 'profile'" class="flex items-center w-full">
                <div class="mr-4 aspect-square h-full">
                    <Avatar :image="staticHostUrl + profile.avatar" class="h-60 w-60 mt-1" />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-mobile" />
                            </InputGroupAddon>
                            <InputText readonly class="w-40" v-model="profile.phone" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-lock" />
                            </InputGroupAddon>
                            <Password toggle-mask v-model="profile.password" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-user" />
                            </InputGroupAddon>
                            <InputText v-model="profile.username" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-map-marker" />
                            </InputGroupAddon>
                            <Dropdown
                                v-model="profile.locId"
                                :options="cities"
                                option-label="name"
                                option-value="locId"
                                placeholder="请输入所在地"
                                editable
                            />
                        </InputGroup>
                        <FileUpload
                            mode="basic"
                            auto
                            customUpload
                            class="w-full"
                            chooseLabel="修改头像"
                            @uploader="customUploader"
                        />
                    </div>
                </div>
            </div>
            <MultiSelect
                v-else
                :max-selected-labels="10"
                :show-toggle-all="false"
                class="w-96"
                display="chip"
                v-model="profile.subCities"
                :options="cities"
                optionValue="locId"
                option-label="name"
                placeholder="订阅地区"
            />
            <Button label="提交修改" class="w-full" @click="handleSubmit" />
        </div>
    </main>
</template>

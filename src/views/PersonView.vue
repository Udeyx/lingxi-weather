<script lang="ts" setup>
import cities from '@/assets/cities.json'
import type { PersonProfile } from '@/types/person'
import { computed, onMounted, ref } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload'
import axios from 'axios'
import { subscribe } from '@/api'
const toast = useToast()

const profile = ref<PersonProfile>({
    phone: '',
    avatar: '',
    password: '',
    username: '',
    locId: +(localStorage.getItem('locId') ?? 114514),
    subCities: []
})

const subscriptions = computed(() =>
    profile.value.subCities.map((locId) => {
        return {
            areaId: locId,
            disasterTypes: [1001, 1002, 1006, 1005, 1004, 1003, 1009, 1010, 1034, 1022]
        }
    })
)

const handleSubmit = async () => {
    toast.add({
        severity: 'success',
        summary: '修改成功',
        life: 3000
    })
    // await subscribe(subscriptions.value)
    toast.add({
        severity: 'warn',
        summary: '出事了',
        life: 2000
    })
}
const customUploader = async (event: FileUploadUploaderEvent) => {
    const file = event.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await axios.post('http://211.159.168.136:4000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        profile.value.avatar = 'http://211.159.168.136:4000' + res.data.url
        localStorage.setItem('avatar', profile.value.avatar)
    } catch (error) {
        console.error('上传失败:', error)
    }
}
onMounted(async () => {
    if (profile.value.avatar === '') {
        profile.value.avatar = 'http://211.159.168.136:4000/files/default_avatar.png'
        localStorage.setItem('avatar', profile.value.avatar)
    }
    profile.value.avatar = localStorage.getItem('avatar')
    profile.value.phone = localStorage.getItem('phone') ?? '33344445555'
    profile.value.username = localStorage.getItem('username') ?? 'user1'
})
</script>

<template>
    <main class="flex h-full flex-col items-center justify-center gap-4">
        <Toast />
        <div class="flex flex-col items-center w-96">
            <div class="flex items-center w-full">
                <div class="mr-4 aspect-square h-full">
                    <Avatar :image="profile.avatar" class="h-full w-full text-5xl" />
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
                class="ml-6 w-[410px] mt-4"
                display="chip"
                v-model="profile.subCities"
                :options="cities"
                optionValue="locId"
                option-label="name"
                placeholder="订阅地区"
            />
        </div>
        <Button label="提交修改" class="w-80" @click="handleSubmit" />
    </main>
</template>

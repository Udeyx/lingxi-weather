<script lang="ts" setup>
import cities from '@/assets/cities.json'
import { ref } from 'vue'
const subCities = ref<string[]>([])
const form = ref({
    phone: '',
    password: '',
    username: '',
    locId: 0
})
</script>

<template>
    <main class="flex h-full flex-col items-center justify-center gap-4">
        <div class="flex flex-col items-center w-96">
            <div class="flex items-center w-full">
                <div class="mr-4 aspect-square h-full">
                    <Avatar label="A" class="h-full w-full text-5xl" />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-mobile" />
                            </InputGroupAddon>
                            <InputText readonly class="w-40" v-model="form.phone" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-lock" />
                            </InputGroupAddon>
                            <Password toggle-mask v-model="form.password" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-user" />
                            </InputGroupAddon>
                            <InputText v-model="form.username" />
                        </InputGroup>
                        <InputGroup>
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
                    </div>
                </div>
            </div>
            <MultiSelect
                class="ml-6 w-[410px] mt-4"
                display="chip"
                v-model="subCities"
                :options="cities"
                option-label="name"
                placeholder="订阅地区"
            />
        </div>
        <Button label="提交修改" class="w-80" />
    </main>
</template>

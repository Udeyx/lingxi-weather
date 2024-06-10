<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { feedback, getFeedbackById, getFeedbacks, sendToOSS, staticHostUrl } from '@/api'
import axios from 'axios'

const feedbacks = ref<{ feedbackId: number; title: string; time: string; status: string }[]>([])

onMounted(async () => {
    const res = await getFeedbacks()
    if (res.status === 200) {
        feedbacks.value = res.data.feedbacks
    }
})

const editorContent = ref('')
const title = ref('')
const feedbackEditVisible = ref(false)
const feedbackDetailVisible = ref(false)
const curFeedback = ref({
    feedbackId: 1,
    title: '',
    content: '',
    answer: '',
    time: '',
    status: 'pending'
})

const submitFeedback = async () => {
    const url = (await sendToOSS(editorContent.value)).data.url
    await feedback({ title: title.value, content: url })
    feedbackEditVisible.value = false
    const res = await getFeedbacks()
    if (res.status === 200) {
        feedbacks.value = res.data.feedbacks
    }
}
</script>

<template>
    <Dialog v-model:visible="feedbackEditVisible" modal header="编辑反馈">
        <InputText v-model="title" placeholder="请输入标题" class="w-full mb-4" />
        <Editor v-model="editorContent" class="h-64" placeholder="请输入反馈内容" />
        <template #footer>
            <Button @click="submitFeedback" label="提交" />
        </template>
    </Dialog>
    <Dialog v-model:visible="feedbackDetailVisible" modal :header="curFeedback.title">
        <div class="prose">
            <h2>反馈内容</h2>
            <div v-html="curFeedback.content" />
            <h2>回答</h2>
            <div v-html="curFeedback.answer" />
        </div>
    </Dialog>
    <main class="flex relative flex-col w-full h-full bg-white/50 backdrop-blur-md">
        <Button
            class="absolute bottom-4 right-4"
            rounded
            icon="pi pi-plus"
            @click="feedbackEditVisible = true"
        />
        <div class="flex flex-col gap-2">
            <Card v-for="feedback in feedbacks" :key="feedback.feedbackId">
                <template #content>
                    <div class="flex items-center justify-between">
                        <p class="pt-3 w-[25%]">{{ feedback.time }}</p>
                        <p class="pt-3 w-[25%]">{{ feedback.title }}</p>
                        <p class="pt-3 w-[25%]">
                            {{ feedback.status === 'finished' ? '已有回复' : '正在处理' }}
                        </p>
                        <Button
                            @click="
                                async () => {
                                    const res = await getFeedbackById(feedback.feedbackId)
                                    if (res.status === 200) {
                                        curFeedback.title = feedback.title
                                        const htmlContent = await axios.get(
                                            staticHostUrl + res.data.content
                                        )
                                        curFeedback.content = htmlContent.data
                                        if (res.data.reply !== '') {
                                            const htmlAnswer = await axios.get(
                                                staticHostUrl + res.data.reply
                                            )
                                            curFeedback.answer = htmlAnswer.data
                                        }
                                        feedbackDetailVisible = true
                                    }
                                }
                            "
                            label="查看详情"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </main>
</template>

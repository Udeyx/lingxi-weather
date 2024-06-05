<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { feedback, getFeedbackById, getFeedbacks, sendToOSS } from '@/api'
import axios from 'axios'

const feedbacks = ref<{ feedbackId: number; title: string; time: string; status: string }[]>([])

onMounted(async () => {
    const res = await getFeedbacks()
    if (res.status === 200) {
        feedbacks.value = res.data.feedbacks
        console.log(res.data.feedbacks)
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
    status: ''
})

const submitFeedback = async () => {
    const url = (await sendToOSS(editorContent.value)).data.url
    console.log(url)
    await feedback({ title: title.value, content: 'http://211.159.168.136:4000' + url })
    feedbackEditVisible.value = false
}
</script>

<template>
    <main class="flex flex-col w-full h-full">
        <div class="flex justify-between items-center">
            <h1 class="text-4xl">用户反馈</h1>
            <el-button type="primary" @click="feedbackEditVisible = true">新建工单</el-button>
        </div>
        <el-dialog width="80%" v-model="feedbackEditVisible">
            <h1 class="text-2xl">编辑反馈</h1>
            <el-input size="large" v-model="title" placeholder="请输入标题" class="pb-8" />
            <QuillEditor
                v-model:content="editorContent"
                theme="snow"
                content-type="html"
                class="h-96"
            />
            <template #footer>
                <el-button @click="submitFeedback" type="primary" class="mt-4">提交</el-button>
            </template>
        </el-dialog>
        <el-divider />
        <el-card v-for="feedback in feedbacks" :key="feedback.feedbackId">
            <div class="flex min-w-[768px] items-center justify-between">
                <p class="pt-3">{{ feedback.time }}</p>
                <p class="pt-3">{{ feedback.title }}</p>
                <p class="pt-3">{{ feedback.status === 'pending' ? '正在处理' : '已有回复' }}</p>
                <el-button
                    @click="
                        async () => {
                            const res = await getFeedbackById(feedback.feedbackId)
                            if (res.status === 200) {
                                curFeedback.title = feedback.title
                                const htmlContent = await axios.get(res.data.content)
                                curFeedback.content = htmlContent.data
                                curFeedback.answer = res.data.answer
                                feedbackDetailVisible = true
                            }
                        }
                    "
                    >查看详情</el-button
                >
            </div>
        </el-card>
        <el-dialog width="80%" v-model="feedbackDetailVisible">
            <template #header>
                {{ curFeedback.title }}
            </template>
            <QuillEditor v-model:content="curFeedback.content" theme="snow" content-type="html" />
            <QuillEditor v-model:content="curFeedback.answer" theme="snow" content-type="html" />
        </el-dialog>
    </main>
</template>

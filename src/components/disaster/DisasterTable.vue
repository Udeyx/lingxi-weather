<template>
    <div class="card w-full">
        <DataTable
            v-model:filters="filters"
            :value="props.disasters"
            paginator
            :rows="12"
            filterDisplay="row"
        >
            <Column
                v-for="column in columns"
                :key="column.field"
                :field="column.field"
                :header="column.header"
                style="width: 20%"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText
                        size="small"
                        v-model="filterModel.value"
                        type="text"
                        @input="filterCallback()"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import type { DataTableFilterMeta } from 'primevue/datatable'
const filters = ref<DataTableFilterMeta>({
    time: { value: null, matchMode: FilterMatchMode.CONTAINS },
    type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    area: { value: null, matchMode: FilterMatchMode.CONTAINS },
    pubTime: { value: null, matchMode: FilterMatchMode.CONTAINS },
    severity: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    text: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const columns: { field: string; header: string }[] = [
    { field: 'time', header: '时间' },
    { field: 'pubTime', header: '发布时间' },
    { field: 'type', header: '类型' },
    { field: 'area', header: '地区' },
    { field: 'severity', header: '危险程度' },
    { field: 'status', header: '状态' },
    { field: 'text', header: '描述' }
]
const props = defineProps<{
    disasters: {
        pubTime: string
        time: string
        type: string
        severity: string
        area: string
        text: string
        status: string
    }[]
}>()
</script>

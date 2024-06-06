<template>
    <div class="card w-full">
        <DataTable
            v-model:filters="filters"
            :value="props.disasters"
            paginator
            :rows="10"
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
    longitude: { value: null, matchMode: FilterMatchMode.CONTAINS },
    latitude: { value: null, matchMode: FilterMatchMode.CONTAINS },
    text: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const columns: { field: string; header: string }[] = [
    { field: 'time', header: '时间' },
    { field: 'type', header: '类型' },
    { field: 'longitude', header: '经度' },
    { field: 'latitude', header: '纬度' },
    { field: 'text', header: '描述' }
]
const props = defineProps<{
    disasters: { time: string; type: string; longitude: string; latitude: string; text: string }[]
}>()
</script>

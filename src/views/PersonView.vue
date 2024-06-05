<script lang="ts" setup></script>

<template>
    <main class="flex h-full flex-col items-center justify-center gap-4">
        <div class="flex items-center">
            <div class="mr-4 aspect-square h-full">
                <Avatar label="A" class="h-full w-full text-5xl" />
            </div>
            <div class="flex flex-col">
                <div class="flex flex-col gap-2">
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-mobile" />
                        </InputGroupAddon>
                        <InputText value="33344445555" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock" />
                        </InputGroupAddon>
                        <Password toggle-mask />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user" />
                        </InputGroupAddon>
                        <InputText value="user1" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-map-marker" />
                        </InputGroupAddon>
                        <InputText value="北京" />
                    </InputGroup>
                </div>
            </div>
        </div>
        <Button label="提交修改" class="w-80" />
    </main>
</template>

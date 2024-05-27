<script setup>
import { ref } from 'vue';
import Mock from 'mockjs'
import singletonPromise from './lib/singleton-promise'
const list = ref([])
const num = ref(0)
const requestList = () => {
  const temp = ++num.value
  const mockData = Mock.mock({
    "list|10": [
      {
        "id|+1": temp * 10 + 1
      }
    ]
  })
  const request = new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData.list)
    }, Math.random() * 3000)
  })
  return singletonPromise('requestList', request).then(value => {
    list.value = value
  })
}

const selectValue = ref()
const options = ref([])
const optionsMock = Mock.mock({
  "list|10": [
    {
      name: "@name()",
      "age|+1": 1000
    }
  ]
})
const selectLoading = ref(false)
const searchOptions = (keyword) => {
  const request = new Promise(resolve => {
    setTimeout(() => {
      resolve(optionsMock.list)
    }, Math.random() * 3000)
  })
  selectLoading.value = true
  return singletonPromise('requestOptions', request).then(value => {
    options.value = value.filter(item => item.name.includes(keyword))
  }).finally(() => {
    selectLoading.value = false
  })
}

</script>

<template>
  <div>
    <div>场景一：列表请求覆盖</div>
    <button type="button" @click="requestList">第{{ num }}次请求列表</button>
    列表数据：
    <div
      style="border: 1px solid red;"
      v-for="item in list"
      :key="item.id"
     >序号{{ item.id }}</div>
     <hr>
     <div>场景二：远程搜索</div>
     <el-select
      v-model="selectValue"
      remote
      filterable
      clearable
      :remote-method="searchOptions"
      :loading="selectLoading"
     >
      <el-option 
        v-for="option in options" 
        :key="option.age"
        :label="option.name"
        :value="option.age"
      />
     </el-select>
  </div>
</template>

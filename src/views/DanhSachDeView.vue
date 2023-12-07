<script setup>
import axiosClient from "@/axios.js";
import {useAuthStore} from "@/stores/auth.js";
import {ref} from "vue";
import router from "@/router/index.js";
const dataGoc = ref([]);
const auth = useAuthStore();
axiosClient.get('/de', {
  headers : {
    Authorization : `Bearer ${auth.token}`
  }
}).then(({data}) => {
  console.log(data)
  dataGoc.value = data;
}).catch(err => console.log(err));
function chon(id){
  router.push({name : 'kiemtra'})
}
function fTime(str){
  const t = new Date(str);
  const thu = [ 'Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
   console.log(t)
  return `${thu[t.getDay()]} ${t.getDate()}-${t.getMonth() + 1}-${t.getFullYear()} ${t.getHours()}:${t.getSeconds()}`;
}
</script>

<template>
  <div class="mt-12 mx-auto w-1/2 rounded bg-yellow-300 p-6">
    <h1 class="mb-3 text-center text-xl">Danh sách đề đã tạo</h1>
    <div class="rounded bg-black p-3 h-96 overflow-y-auto">
      <div @click="chon(item.id)" :key="item.id" v-for="item in dataGoc" class="cursor-pointer rounded bg-white p-3 mb-3">
        <p>Name : {{item.name}}</p>
        <p>Số câu : {{item.socau}} câu</p>
        <p>Thời gian tạo : {{fTime(item.created_at)}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
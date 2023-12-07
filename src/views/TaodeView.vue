<script setup>
import {computed, reactive, ref} from "vue";
import axiosClient from "@/axios.js";
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";

const listChuong = ref([]);
const listBai = ref([]);
const listKT = ref([]);
const input = reactive({
  inputChuong : [],
  inputBai : [],
  inputKT : [],
})

const result = reactive({
  socau : 10,
  mucdo : 1,
  kts : [],
  namede : '',
});

const baiCompute =computed(() => {
  if (input.inputChuong.length > 0){
    return listBai.value.filter((item) => input.inputChuong.includes(item.chuongId));
  } else {
    return listBai.value;
  }
})
const ktCompute = computed(()=>{
  if (input.inputBai.length > 0){
    return listKT.value.filter((item) => input.inputBai.includes(item.baiId));
  } else {
    return listKT.value;
  }
})
const resultKtCompute = computed(()=>{
  if (input.inputKT.length > 0){
    return ktCompute.value.filter(item => input.inputKT.includes(item.id))
  } else {
    return [];
  }
})
axiosClient.get('/chuong').then(({data}) => {
  console.log(data);
  listChuong.value = data.data;
})
axiosClient.get('/bai').then(({data}) => {
  console.log(data);
  listBai.value = data.data;
})
axiosClient.get('/kienthuc').then(({data}) => {
  console.log(data);
  listKT.value = data.data;
})
async function handleSubmit(){
  const auth = useAuthStore()
  if (!result.namede){
    alert('Chưa nhập tên đề');
  } else if (result.kts.length === 0) {
    alert('Chưa chọn bộ lọc');
  } else {
    console.log(result.kts);
    try {
      console.log(result)
      const {data} = await axiosClient.post('/cauhoi/taode',{...result}, {
        headers : {
          Authorization : `Bearer ${auth.token}`
        }
      })
      console.log(data.data)
      localStorage.setItem('cauhoi', JSON.stringify(data.data));
      await router.push({name: 'kiemtra'})
    } catch(err){
      console.log(err.response);
    }
  }
}
</script>

<template>
  <div class="flex">
    <div class="w-1/2 bg-yellow-300 px-6 py-3">
      <div class="mb-3">
        <p class="mb-1 font-bold">Chương</p>
        <select multiple class="h-24 w-full rounded p-2 shadow" v-model="input.inputChuong">
          <option v-for="item in listChuong" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="mb-3">
        <p class="mb-1 font-bold">Bai</p>
        <select multiple class="h-24 w-full rounded p-2 shadow" v-model="input.inputBai">
          <option v-for="item in baiCompute" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="mb-3">
        <p class="mb-1 font-bold">Kien thuc</p>
        <select multiple class="h-24 w-full rounded p-2 shadow" v-model="input.inputKT">
          <option v-for="item in ktCompute" :value="item.id">{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="w-1/2 bg-orange-300 px-6 py-3">
      <div class="mb-3">
        <p class="mb-1 font-bold">Số câu hỏi</p>
        <select class="w-full rounded p-1 shadow" v-model="result.socau">
          <option value="10">10 câu</option>
          <option value="15">15 câu</option>
          <option value="20">20 câu</option>
          <option value="40">40 câu</option>
          <option value="50">50 câu</option>
        </select>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Mức độ</p>
        <select class="w-full rounded p-1 shadow" v-model="result.mucdo">
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Tên đề</p>
        <input class="w-full rounded p-1 shadow" v-model="result.namede"/>
      </div>

      <select multiple class="mb-3 w-full h-32 overflow-y-auto rounded bg-white p-2 shadow" v-model="result.kts">
        <option v-for="item in resultKtCompute"  :value="item.id" class="bg-gray-100 p-1 shadow">{{item.name}}</option>
      </select>

      <div class="flex items-center justify-between">
        <p>Bấm submit để tạo đề</p>
        <button @click="handleSubmit" class="rounded bg-black px-3 py-2 text-white">Tao de</button>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
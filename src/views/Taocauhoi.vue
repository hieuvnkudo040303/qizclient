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
  name : 'Cauhoi',
  mucdo : null,
  noidung : '',
  image : null,
  cauA : '',
  cauB : '',
  cauC : '',
  cauD : '',
  dung : null,
  kienthucId : [],
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
axiosClient.get('/chuong').then(({data}) => {
  listChuong.value = data.data;
})
axiosClient.get('/bai').then(({data}) => {
  listBai.value = data.data;
})
axiosClient.get('/kienthuc').then(({data}) => {
  listKT.value = data.data;
})
function selectFile(e){
  result.image = e.target.files[0];
}
async function handleSubmit(){
  const auth = useAuthStore()
    console.log(result.kts);
    try {
      const form = new FormData();
      form.append('name', result.name);
      form.append('noidung', result.noidung);
      form.append('mucdo' , result.mucdo);
      form.append('image', result.image);
      form.append('cauA', result.cauA);
      form.append('cauB', result.cauB);
      form.append('cauC', result.cauC);
      form.append('cauD', result.cauD);
      form.append('kienthucId', result.kienthucId);
      form.append('dung', result.dung - 1);
      const {data}= await axiosClient.post('/cauhoi/', form);
      result.noidung = '';
      result.cauA = '';
      result.cauB = '';
      result.cauC = '';
      result.cauD = '';
      result.dung = null;
      result.image = null;
    } catch(err){
      console.log(err.response);
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
        <p class="mb-1 font-bold">Bài</p>
        <select multiple class="h-24 w-full rounded p-2 shadow" v-model="input.inputBai">
          <option v-for="item in baiCompute" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="mb-3">
        <p class="mb-1 font-bold">Kiến thức</p>
        <select multiple class="h-24 w-full rounded p-2 shadow" v-model="result.kienthucId">
          <option v-for="item in ktCompute" :value="item.id">{{item.name}}</option>
        </select>
      </div>
    </div>
    <div class="w-1/2 bg-orange-300 px-6 py-3">
      <div class="mb-3">
        <p class="mb-1 font-bold">Nội dung câu hỏi</p>
        <input class="w-full rounded p-1 shadow" v-model="result.noidung"/>
      </div>

      <div>
        <input type="file" @change="selectFile">
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Mức độ</p>
        <input class="w-full rounded p-1 shadow" v-model="result.mucdo"/>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Câu A</p>
        <input class="w-full rounded p-1 shadow" v-model="result.cauA"/>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Câu B</p>
        <input class="w-full rounded p-1 shadow" v-model="result.cauB"/>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Câu C</p>
        <input class="w-full rounded p-1 shadow" v-model="result.cauC"/>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Câu D</p>
        <input class="w-full rounded p-1 shadow" v-model="result.cauD"/>
      </div>

      <div class="mb-3">
        <p class="mb-1 font-bold">Câu đúng</p>
        <input class="w-full rounded p-1 shadow" v-model="result.dung"/>
      </div>

      <div class="flex items-center justify-between">
        <p>Bấm submit để tạo câu hỏi</p>
        <button @click="handleSubmit" class="rounded bg-black px-3 py-2 text-white">Tạo câu hỏi</button>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
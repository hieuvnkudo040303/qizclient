<script setup>
import {computed, onBeforeMount, onMounted, reactive, ref} from "vue";
import axiosClient from "@/axios.js";
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";
const auth = useAuthStore();
const dataGoc = ref(JSON.parse(localStorage.getItem('cauhoi')));
const dem = ref(0);
const dataColorLuachon = reactive(Array(4).fill('bg-white'));
const dataCauhoi = computed(() => {
  return dataGoc.value.cauhoi
});
const dataLuachon = reactive(Array(dataCauhoi.value.length).fill(-1));
const dataDapan = reactive(Array(dataCauhoi.value.length).fill(-1));
const dataTraloi = computed(() => {
  return dataGoc.value.traloi;
})
const dataHoanthanh = computed(() => {
  return dataTraloi.value.map((item) => item.luachonId)
});
onMounted(() => {
  axiosClient.get(`/de/${dataGoc.value.id}`, {
    headers : {
      Authorization : `Bearer ${auth.token}`
    }
  }).then(({data}) => {
    dataGoc.value = data.data;
    dataTraloi.value.forEach((item, index) => {
      dataLuachon[index] = dataCauhoi.value[index].luachon.findIndex(i => i.id === item.luachonId);
    })
    dataCauhoi.value.forEach((item, index) => {
      const luachon = item.luachon;
      dataDapan[index] = luachon.findIndex(i => i.status === 1);
    })
    console.log('data tra loi', dataTraloi.value)
    console.log('data luachon', dataLuachon)
    console.log('data dap an', dataDapan)
    reset();
  }).catch((err) => {
    console.log(err)
  })
})
const currentCauhoi = computed(()=>{
  return dataCauhoi.value[dem.value];
})
const currentLuaChon = computed(() => {
  return currentCauhoi.value.luachon;
})
const currentDapAn = computed(() =>{
  return currentLuaChon.value.findIndex(item => item.status === 1);
})
const diem = computed(() => {
  let dem = 0
  for(let i=0; i < dataCauhoi.value.length; i++){
    if ((dataLuachon[i] === dataDapan[i]) && (dataDapan[i] !== -1)){
      dem++;
    }
  }
  return dem*(10/dataCauhoi.value.length);
})
function reset(){
  dataColorLuachon.fill('bg-white');
  dataDapan[dem.value] = currentDapAn.value;
  if (dataHoanthanh.value[dem.value]){
    let luachonID = dataTraloi.value[dem.value].luachonId;
    let i = getIndexById(luachonID);
    dataColorLuachon[i] = 'bg-red-300';
    dataColorLuachon[currentDapAn.value] = 'bg-green-300';
  }
}
onMounted(() => {
  dataColorLuachon.fill('bg-white')
  if(dataHoanthanh.value[dem.value]){
    const id = dataTraloi.value[dem.value].luachonId;
    const index = getIndexById(id);
    dataColorLuachon[index] = 'bg-red-300';
    dataColorLuachon[currentDapAn.value] = 'bg-green-300';
  }
})
function next(){
  if (dem.value < dataCauhoi.value.length-1){
    dem.value++;
    reset();
  }
}
function back(){
  if (dem.value > 0){
    dem.value--;
    reset();
  }
}
function step(index){
  if (index >= 0 && index < dataCauhoi.value.length){
    dem.value = index;
  }
}
function colorChiso(index){
  if (index === dem.value){
    return 'bg-blue-300';
  } else if (dataDapan[index] === dataLuachon[index] && dataDapan[index] !== -1){
    return 'bg-green-300'
  } else if (dataLuachon[index] !== -1 && dataLuachon[index] !== dataDapan[index]){
    return 'bg-red-300';
  } else {
    return 'bg-white';
  }
}
function getIndexById(id){
  return currentLuaChon.value.findIndex(item => item.id === id);
}
async function check(index){
  if (!dataHoanthanh.value[dem.value]){
    dataColorLuachon[index] = 'bg-red-300'
    dataColorLuachon[currentDapAn.value] = 'bg-green-300';
    dataHoanthanh.value[dem.value] = true;
    dataLuachon[dem.value] = index;
    try {
      const {data} = await axiosClient.put('/traloi', {
        id : dataTraloi.value[dem.value].id,
        luachonId : currentLuaChon.value[index].id,
      });
      console.log(data);
    } catch (err){
      console.log(err)
    }
  } else {
    console.log('Đã hoàn thành');
  }
}
function lamlai(){
  dataHoanthanh.value.fill(false)
  reset();
  axiosClient.post('/traloi', {
    deId : dataGoc.value.id
  },{
    headers : {
      Authorization : `Bearer ${auth.token}`
    }
  })
      .then((data) => console.log(data))
      .catch(err => console.log(err))
}
function ketthuc(){
  router.push({name : 'taode'});
}
</script>
<template>
  <div class="flex">
    <div class="max-h-screen w-1/4 bg-yellow-300 p-3">
      <h1 class="mb-3 text-center text-xl">Trạng thái</h1>
      <div class="mb-3">
        <button @click="step(index)" :class="colorChiso(index)" v-for="(item, index) in dataCauhoi" class="mb-1 mr-1 h-8 w-8 rounded">{{index+1}}</button>
      </div>
      <div class="mb-3 flex justify-between">
        <button @click="back" class="rounded bg-black px-2 py-1 text-white">Back</button>
        <button @click="next" class="rounded bg-black px-2 py-1 text-white">Next</button>
      </div>
      <div class="mb-3">
        <button @click="lamlai" class="w-full rounded bg-black py-1 text-white">Lam lai</button>
      </div>
      <div class="mb-3">
        <button @click="ketthuc" class="w-full rounded bg-black py-1 text-white">Kết thúc</button>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-xl">Điểm</p>
        <div>
          <strong class="text-xl">{{diem}}</strong>
        </div>
      </div>
    </div>
    <div class="max-h-screen w-3/4 overflow-y-auto bg-orange-300 p-3">
      <p class="mb-1 text-xl">Nội dung</p>
      <div class="mb-3 rounded bg-white p-3 shadow">{{currentCauhoi.noidung}}</div>
      <div class="grid grid-cols-2 gap-3">
        <div @click="check(index)" :class="dataColorLuachon[index]" v-for="(item, index) in currentLuaChon" :key="item.id" class="rounded p-3">{{item.noidung}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
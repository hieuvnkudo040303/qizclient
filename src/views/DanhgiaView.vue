<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import axiosClient from "@/axios.js";
import {useAuthStore} from "@/stores/auth.js";

const route = useRoute();
const auth = useAuthStore();

const dataGoc = ref([]);
const title = ref('Dang cho');
const result = ref([]);

onMounted(() => {
  if (!route.params.id){
    axiosClient.get('/traloi/all', {
      headers : {
        Authorization : `Bearer ${auth.token}`
      }
    })
        .then(({data}) => {
          dataGoc.value = data;
          title.value = 'Tất cả câu trả lời của bạn';
          const kienthuc = dataGoc.value.reduce((r, item) => {
            if (!r.includes(item.kienthuc_id)) {
              r.push(item.kienthuc_id);
            }
            return r;
          }, []);
          result.value = kienthuc.reduce((r, item) => {
            let dung = Number(demcau(item, 1))
            let sai = Number(demcau(item, 0));
            let tile = Number((dung/(dung+sai))*100);
            r.push({
              name : dataGoc.value.filter(i =>i.kienthuc_id === item)[0].name,
              socaudung : dung,
              socausai : sai,
              tile : tile,
            });
            return r;
          }, [])
        })
        .catch((err) => console.log(err))
  } else {
    const id = route.params.id;
    axiosClient.get(`/traloi/${id}`, {
      headers : {
        Authorization : `Bearer ${auth.token}`
      }
    })
        .then(({data}) => {
          dataGoc.value = data;
          title.value = data[0].nameDe;
          const kienthuc = dataGoc.value.reduce((r, item) => {
            if (!r.includes(item.kienthuc_id)) {
              r.push(item.kienthuc_id);
            }
            return r;
          }, []);
          result.value = kienthuc.reduce((r, item) => {
            let dung = Number(demcau(item, 1))
            let sai = Number(demcau(item, 0));
            let tile = Number((dung/(dung+sai))*100);
            r.push({
              name : dataGoc.value.filter(i =>i.kienthuc_id === item)[0].name,
              socaudung : dung,
              socausai : sai,
              tile : tile,
            });
            return r;
          }, [])
        })
        .catch((err) => console.log(err))
  }
})
function demcau(id, trangthai){
  return dataGoc.value.reduce((dem, item) => {
    if (item.kienthuc_id === id && item.status === trangthai){
      dem++;
    }
    return dem;
  },0)
}
function choloikhuyen(tile){
  tile = Number(tile);
  console.log(tile);
  if (tile < 50){
    return 'Cải thiện gấp'
  } else if (tile < 80){
    return 'Tạm ổn'
  } else {
    return 'Tốt'
  }
}
</script>

<template>
  <div class="mx-auto mt-12 w-3/4 p-6 bg-amber-600">
    <div class="text-center bg-yellow-200 p-3 h-96 overflow-y-auto">
      <h1 class="mb-3 font-bold">{{title}}</h1>
      <table class="w-full table-auto bg-white border border-collapse border-black overflow-y-autos">
        <thead>
        <tr>
          <th class="text-blue-500">Ten kien thuc</th>
          <th class="text-green-500">So cau dung</th>
          <th class="text-red-500">So cau sai</th>
          <th class="text-rex-300">Tỉ lệ</th>
          <th class="text-rex-300">Lời khuyên</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in result" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.socaudung }}</td>
          <td>{{ item.socausai }}</td>
          <td>{{ item.tile }}</td>
          <td>{{choloikhuyen(item.tile)}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
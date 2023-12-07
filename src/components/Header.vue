<script setup>
import {useAuthStore} from "@/stores/auth.js";
import axiosClient from "@/axios.js";
import router from "@/router/index.js";

const auth = useAuthStore();
const user = auth.user;
async function logout(){
  try {
    await axiosClient.post('/auth/logout', {}, {
      headers : {
        Authorization : `Bearer ${auth.token}`
      }
    })
    auth.removeToken();
    auth.removeUser();
    await router.push({name : 'login'});
  } catch (err) {
    console.log(err.response);
  }
}
</script>

<template>
  <div class="flex items-center justify-between bg-orange-400 px-6 py-3">
    <div class="flex items-center gap-5">
      <p class="text-3xl font-bold">Logo</p>
      <ul class="flex gap-5">
        <li class="cursor-pointer hover:text-white">Tạo đề</li>
        <li class="cursor-pointer hover:text-white">Đánh giá</li>
      </ul>
    </div>
    <div class="flex items-center gap-5">
      <p>Chào <strong>{{user.name}}</strong></p>
      <button @click="logout" class="rounded bg-black px-2 py-1 font-bold text-white">Dang xuat</button>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
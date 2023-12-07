<script setup>
import {reactive, ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import axiosClient from "@/axios.js";
import router from "@/router/index.js";

const input = reactive({
  name : null,
  email : null,
  password : null,
  repassword : null,
})
const errMsg = ref(null);
async function handleSubmit(){
  errMsg.value = null;
  if (!input.name){
    errMsg.value = 'Chưa nhập tên';
  } else if(!input.email){
    errMsg.value = 'Chưa nhập email';
  } else if (!input.password){
    errMsg.value = 'Chưa nhập password';
  } else if (input.password !== input.repassword){
    errMsg.value = 'Nhập lại password chưa đúng';
  } else {
    try {
      const auth = useAuthStore()
      const {data} = await axiosClient.post('/auth/register',{...input});
      console.log(data);
      auth.setToken(data.token);
      auth.setUser(data.user);
      await router.push({name: 'taode'});
    } catch (err){
      if (err.response){
        errMsg.value = err.response.data.message;
      }
    }
  }
}
</script>

<template>
  <div class="mx-auto my-12 w-1/2 rounded bg-yellow-300 p-6">
    <h1 class="mb-3 text-center text-3xl">Signup</h1>
    <div v-if="errMsg" class="mb-3 rounded bg-red-500 p-3 font-bold text-white">{{errMsg}}</div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <p class="mb-1">Name</p>
        <input type="text" class="w-full rounded px-3 py-2 shadow" v-model.trim="input.name"/>
      </div>
      <div class="mb-3">
        <p class="mb-1">Email</p>
        <input type="text" class="w-full rounded px-3 py-2 shadow" v-model.lazy="input.email"/>
      </div>
      <div class="mb-3">
        <p class="mb-1">Password</p>
        <input type="password" class="w-full rounded px-3 py-2 shadow" v-model.trim="input.password"/>
      </div>
      <div class="mb-3">
        <p class="mb-1">Nhập lại Password</p>
        <input type="password" class="w-full rounded px-3 py-2 shadow" v-model.trim="input.repassword"/>
      </div>
      <div class="flex items-center justify-between">
        <RouterLink :to="{name: 'login'}">Đã có tài khoản <strong> Đăng Nhập</strong></RouterLink>
        <button class="rounded bg-black px-3 py-2 text-white">Submit</button>
      </div>
    </form>
  </div>

</template>

<style scoped lang="scss">

</style>
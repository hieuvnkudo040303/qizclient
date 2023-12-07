import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', function (){
    const user = ref(JSON.parse(localStorage.getItem('user')));
    const token = ref(localStorage.getItem('token'));
    function setToken(t){
        token.value = t;
        localStorage.setItem('token', t)
    }
    function setUser(u){
        user.value = u;
        localStorage.setItem('user', JSON.stringify(u))
    }
    function removeToken(){
        token.value = null;
        localStorage.removeItem('token');
    }
    function removeUser(){
        user.value = null;
        localStorage.removeItem('user');
    }
    return {
        user,
        token,
        setToken,
        setUser,
        removeUser,
        removeToken,
    }
})
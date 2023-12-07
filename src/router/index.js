import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import Layout from "@/components/Layout.vue";
import TaodeView from "@/views/TaodeView.vue";
import KiemtraView from "@/views/KiemtraView.vue";
import {useAuthStore} from "@/stores/auth.js";
import DanhSachDeView from "@/views/DanhSachDeView.vue";

const router = createRouter({
    history : createWebHistory(),
    routes : [
        {
            path:'/login',
            name : 'login',
            component: LoginView
        },
        {
            path:'/signup',
            name : 'signup',
            component: SignupView
        },
        {
            path:'/',
            component : Layout,
            children : [
                {
                    path : 'taode',
                    meta : {requiredAuth : true},
                    name : 'taode',
                    component : TaodeView
                },
                {
                    path : 'kiemtra',
                    meta : {requiredAuth : true},
                    name : 'kiemtra',
                    component : KiemtraView
                },
                {
                    path : 'danhsachde',
                    meta : {requiredAuth : true},
                    name : 'danhsachde',
                    component : DanhSachDeView
                }
            ]
        }
    ]
})
router.beforeEach((to, from, next)=>{
    const auth = useAuthStore();
    if (to.meta.requiredAuth && !auth.token){
        next({name: 'login'});
    } else if  (auth.token && (to.name === 'login' || to.name === 'signup')) {
        next({name: 'taode'});
    } else {
        next();
    }
})
export default router;

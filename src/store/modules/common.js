import { defineStore } from 'pinia'
import { loginOutApi } from "@/api/login";
import microApp from "@micro-zoe/micro-app"
import { setStore, clearStore, getStore } from "@/plugins/store";

import router from '@/router'
import useTagsViewStore from '@/store/modules/tagsView.js'
import Cookies from "js-cookie";
import axios from 'axios'

const commonStore = defineStore(
  'common-store',
  {
    state: () => ({
      menus: null,
      loginSuccess: false,
      userInfo: null
    }),
    getters: {
      getMenus: (state) => {
        return state.menus || getStore({ name: 'menus' })
      },
      getUserInfo: (state) => {
        return state.userInfo || getStore({ name: 'userInfo' })
      },
      getloginSuccess: (state) => {
        return state.loginSuccess
      },
    },
    actions: {
      setLoginSuccess() {
        this.loginSuccess = true
      },
      setLoginFail() {
        this.loginSuccess = false
      },
      setMenus(list) {
        this.menus = list || []
      },
      setUserInfo(user) {
        this.userInfo = user
      },
      async loginOut() {

        const tagViewStore = useTagsViewStore();
        const token = Cookies.get(import.meta.env.VITE_TOKEN)
        this.loginSuccess = false
        const deleteAllCookies = () => {
          var cookies = document.cookie.split(";");
          for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = name + "=;domain=.gpyh.com;=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
          }
        }
        // 使用示例  
        const reset = () => {
          deleteAllCookies();
          clearStore({});
          tagViewStore.resetTagMenus()
          this.menus = []
        }
        try {
          if (token) {
            const { data } = await loginOutApi({ serviceUrl: window.location.href })
            if (data.resultData.casLogoutUrl) {
              await axios({
                url: data.resultData.casLogoutUrl,
                headers: {
                  authorization: Cookies.get(import.meta.env.VITE_TGC),
                }
              })
            }
            // axios()

            await reset()
          }
        } catch {
          reset()
        }
        microApp.getAllApps().map(async item => {
          if (item !== 'g-login') {
            await microApp.unmountApp(item, { destroy: true })
          }
        })
        window.location.href = import.meta.env.VITE_LOGIN_URL
        // router.replace("/g-login/login");
      }
    }
  })

export default commonStore

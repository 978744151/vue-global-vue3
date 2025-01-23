import { defineStore } from 'pinia'
import router from '../../router/index.ts'
import { setStore, clearStore, getStore } from "@/plugins/store";

const useTagsViewStore = defineStore(
  'tags-view',
  {
    state: () => reactive({
      visitedViews: [],
      cachedViews: [],
      iframeViews: [],
      tagView: [{
        path: `/home`,
        name: "homeIndex",
        meta: {
          menuName: "首页",
          appName: "",
          url: "",
        },
      }],
      cyViewList: [],
      isBack: false, //暂时无用

    }),
    getters: {
      getTagViews: (state) => {
        return state.tagView
      },
      getIsBack: (state) => {
        return state.isBack
      },
      getCyViewList: (state) => {
        return state.cyViewList
      }
    },
    actions: {
      setTagStore(tagView) {
        setStore({
          name: 'tagView',
          content: tagView,
          type: "local",
        })
      },
      async setCyMenus(list) {
        this.cyViewList = list
      },
      async resetTagMenus() {
        for (let i = 0; i < this.tagView.length; i++) {
          this.tagView.splice(i, 1)
          i--
        }
        this.tagView.push({
          path: `/`,
          name: "homeIndex",
          meta: {
            menuName: "首页",
            appName: "",
            url: "",
          },
        })
        this.setTagStore(this.tagView)
      },
      /**
       item : {
        meta:{
          menuName:"", //必填 菜单名称
          link:"" //g-back系统必填,iframe跳转,其他系统非必填
          appName:"" //appId 必填
         },
         name:"", //必填  唯一名称
         path:"" //必填 唯一路由
         }
       */
      addTagViews(item) {
        const isHashTag = this.tagView.findIndex((e) => item.path === e.path);
        if (Object.prototype.toString.call(item) === '[object Object]') {
          if (isHashTag === -1) this.tagView.push(item);
        } else {
          const tagViewIds = this.tagView.map((e) => e.path)
          item?.map(e => {
            if (!tagViewIds.includes(e.path)) {
              this.tagView.push(e);
            }
          })
        }
        this.setTagStore(this.tagView)
      },
      delTagViews(index) {
        this.tagView.splice(index, 1);
        this.setTagStore(this.tagView)
      },
      addView(view) {
        this.addVisitedView(view)
        this.addCachedView(view)
        if (view.meta.link) {
          this.addIframeView(view)
        }
      },
      addIframeView(view) {
        if (!view?.path) return
        if (this.iframeViews.some(v => v.meta.path === view.meta.path)) return
        this.iframeViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          })
        )
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view?.meta?.title || 'no-name'
          })
        )
      },
      addVisitedView(view) {
        if (this.visitedViews.some(v => v.path === view.path)) return
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view?.meta?.title || 'no-name'
          })
        )
      },
      addCachedView(view) {
        if (this.cachedViews.includes(view?.name)) return
        if (!view.meta.noCache) {
          this.cachedViews.push(view?.name)
        }
      },
      delView(view) {
        return new Promise(resolve => {
          this.delVisitedView(view)
          this.delCachedView(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews],
            iframeViews: [...this.iframeViews]
          })
        })
      },
      delVisitedView(view) {
        return new Promise(resolve => {
          for (const [i, v] of this.visitedViews.entries()) {
            if (v.path === view.path) {
              this.visitedViews.splice(i, 1)
              break
            }
          }
          this.iframeViews = this.iframeViews.filter(item => item.path !== view.path)
          resolve([...this.visitedViews])
        })
      },
      delIframeView(view) {
        return new Promise(resolve => {
          this.iframeViews = this.iframeViews.filter(item => item.name !== view.name)
          resolve([...this.iframeViews])
          // this.iframeViews = this.iframeViews.slice();
        })
      },
      refreshIframeView(view) {
        return new Promise(resolve => {
          // console.log(view.link)
          view.meta.link = view.link
          resolve([...this.iframeViews])
        })
      },
      delCachedView(view) {
        return new Promise(resolve => {
          const index = this.cachedViews.indexOf(view.name)
          index > -1 && this.cachedViews.splice(index, 1)
          resolve([...this.cachedViews])
        })
      },
      delOthersViews(view) {
        return new Promise(resolve => {
          this.delOthersVisitedViews(view)
          this.delOthersCachedViews(view)
          this.delOthersIframeViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews],
            iframeViews: [...this.iframeViews]
          })
        })
      },
      delOthersVisitedViews(view) {
        return new Promise(resolve => {
          this.visitedViews = this.visitedViews.filter(v => {
            return v.meta.affix || v.path === view.path
          })
          this.iframeViews = this.iframeViews.filter(item => item.path === view.path)
          resolve([...this.visitedViews])
        })
      },
      delOthersIframeViews(view) {
        return new Promise(resolve => {
          const index = this.iframeViews.indexOf(view.name)
          if (index > -1) {
            this.iframeViews = this.iframeViews.slice(index, index + 1)
          } else {
            this.iframeViews = []
          }
          resolve([...this.iframeViews])
        })
      },
      delOthersCachedViews(view) {
        return new Promise(resolve => {
          const index = this.cachedViews.indexOf(view.name)
          if (index > -1) {
            this.cachedViews = this.cachedViews.slice(index, index + 1)
          } else {
            this.cachedViews = []
          }
          resolve([...this.cachedViews])
        })
      },
      delAllViews(view) {
        return new Promise(resolve => {
          this.delAllVisitedViews(view)
          this.delAllCachedViews(view)
          resolve({
            visitedViews: [...this.visitedViews],
            cachedViews: [...this.cachedViews],
            iframeViews: [...this.iframeViews]
          })
        })
      },
      delAllVisitedViews(view) {
        return new Promise(resolve => {
          const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
          this.visitedViews = affixTags
          this.iframeViews = []
          resolve([...this.visitedViews])
        })
      },
      delAllCachedViews(view) {
        return new Promise(resolve => {
          this.cachedViews = []
          resolve([...this.cachedViews])
        })
      },
      updateVisitedView(view) {
        for (let v of this.visitedViews) {
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      },
      delRightTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex(v => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            if (idx <= index || (item.meta && item.meta.affix)) {
              return true
            }
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            if (item.meta.link) {
              const fi = this.iframeViews.findIndex(v => v.path === item.path)
              this.iframeViews.splice(fi, 1)
            }
            return false
          })
          resolve([...this.visitedViews])
        })
      },
      delLeftTags(view) {
        return new Promise(resolve => {
          const index = this.visitedViews.findIndex(v => v.path === view.path)
          if (index === -1) {
            return
          }
          this.visitedViews = this.visitedViews.filter((item, idx) => {
            if (idx >= index || (item.meta && item.meta.affix)) {
              return true
            }
            const i = this.cachedViews.indexOf(item.name)
            if (i > -1) {
              this.cachedViews.splice(i, 1)
            }
            if (item.meta.link) {
              const fi = this.iframeViews.findIndex(v => v.path === item.path)
              this.iframeViews.splice(fi, 1)
            }
            return false
          })
          resolve([...this.visitedViews])
        })
      }
    }
  })

export default useTagsViewStore

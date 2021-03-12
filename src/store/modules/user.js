import storage from 'store'
import { getInfo, login, logout } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
// import md5 from 'md5'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    hasGetInfo: false,
    info: {},
    account: '',
    gender: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_HAS_GET_INFO: (state, hasGetInfo) => {
      state.hasGetInfo = hasGetInfo
    },
    RESET_INFO: (state) => {
      state.token = ''
      state.name = ''
      state.info = {}
      state.hasGetInfo = false
      state.welcome = ''
      state.avatar = ''
      storage.remove(ACCESS_TOKEN)
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_GENDER: (state, gender) => {
      state.gender = gender
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      console.log('进入这里')
      const { account, password, keepLogin } = userInfo
      return new Promise((resolve, reject) => {
        const pass = password
        login({
          account: account,
          pwd: pass
          // keepLogin: keepLogin
        }).then(response => {
          const { data } = response
          console.log('data', data)
          let time = 2 * 60 * 60 * 1000
          if (keepLogin) {
            time = 7 * 24 * 60 * 60 * 1000
          }
          storage.set(ACCESS_TOKEN, data['token'], time)
          commit('SET_TOKEN', data['token'])
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { data } = response
          console.log(response)
          // let time = 2 * 60 * 60 * 1000
          // if (keepLogin) {
          //   time = 7 * 24 * 60 * 60 * 1000
          // }
          // storage.set(ACCESS_TOKEN, data['token'])
          // commit('SET_TOKEN', data['token'])

          commit('SET_HAS_GET_INFO', true)
          commit('SET_NAME', { name: data.name, welcome: welcome() })
          commit('SET_INFO', data)
          commit('SET_ACCOUNT', data.account)
          commit('SET_GENDER', data.gender)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve) => {
        logout().then(() => {
          commit('RESET_INFO')
          resolve()
        }).catch(() => {
          commit('RESET_INFO')
          resolve()
        })
      })
    },

    // 信息失效
    ResetToken ({ commit }) {
      return new Promise(resolve => {
        commit('RESET_INFO')
        resolve()
      })
    }
  }
}

export default user

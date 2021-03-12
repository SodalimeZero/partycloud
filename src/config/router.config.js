// eslint-disable-next-line
import { BasicLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
import RouteView from '@/layouts/RouteView'
import BlankLayout from '@/layouts/BlankLayout'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/branch',
    children: [
      // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/analysis',
      //   component: RouteView,
      //   meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
      //       name: 'Analysis',
      //       component: () => import('@/views/dashboard/Analysis'),
      //       meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
      //     }
      //   ]
      // },

      {
        path: '/branch',
        name: 'Branch',
        component: () => import('@/views/branch/branch'),
        // redirect: '/branch',
        meta: { title: '支部管理', icon: 'bars' }
      },

      {
        path: '/news',
        name: 'News',
        // component: () => import('@/views/news/news'),
        component: RouteView,
        redirect: '/newsItem',
        meta: { title: '新闻管理', icon: 'book' },
        children: [
          {
            path: '/newsItem',
            name: 'newsItem',
            component: () => import('@/views/news/news'),
            meta: { title: '类型管理', icon: 'edit' }
          },
          {
            path: '/news/addNews',
            name: 'AddNews',
            component: () => import('@/views/news/component/input'),
            meta: { title: '添加新闻', icon: 'plus-circle' }
          }
        ]
      },

      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/user/UserManage'),
        // redirect: '/user/list',
        meta: { title: '用户管理', icon: 'user' }
      },

      {
        path: '/user/personSpace',
        name: 'PersonSpace',
        component: () => import('@/views/user/PersonSpace'),
        meta: { title: '个人中心', icon: 'user' },
        hidden: true
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: BlankLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login2')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/template',
    component: RouteView,
    hidden: true,
    children: [
      {
        path: 'login1',
        name: 'Login1',
        component: () => import('@/views/user/Login1')
      },
      {
        path: 'login2',
        name: 'Login2',
        component: () => import('@/views/user/Login2')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

// import post from '@/api/api.js'
import request from '@/utils/request'
import { baseList, post } from '@/api/api'

const baseUrl = '/newsNotice'

const api = {
  delete: '/newsNotice/delete',
  change: '/newsNotice/update',
  select: '/newsNotice/list',
  edit: '/newsNotice/update',
  add: '/newsNotice/add'
}
export default api

/**
 * 添加新闻
 * @param data
 */
export function addNews (data) {
  return request({
    url: api.add,
    data: data,
    methods: 'post'
  })
}

export function changeState (data) {
  return request({
    url: api.change,
    data: data,
    method: 'post'
  })
}

/**
 * 删除新闻
 * @param data
 */
export function deleteNews (data) {
  // return request({
  //   url: api.delete,
  //   data: data,
  //   method: 'post'
  // })
  return post(baseUrl + '/delete', data)
}

/**
 * 编辑新闻
 * @param data
 */
export function editNews (data) {
  return request({
    url: api.edit,
    data: data,
    method: 'post'
  })
}

/**
 * 列出所有新闻
 */
export function getNews () {
  return baseList(baseUrl)
}

/**
 * 查找新闻
 * @param data
 */
export function selectNews (data) {
  return request({
    url: api.select,
    data: data,
    method: 'post'
  })
}

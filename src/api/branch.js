import request from '@/utils/request'

const api = {
  listBranch: '/branch/list',
  addBranch: '/branch/add',
  updateBranch: '/branch/update',
  deleteBranch: '/branch/delete'
  // selectBranch: '/branch/list'
}

export default api

/**
 * 获取所有的支部信息
 * @returns {AxiosPromise}
 */
export function getBranchList () {
  return request({
    url: api.listBranch,
    method: 'get'
  })
}

/**
 * 查找支部
 * @param data
 * @returns {AxiosPromise}
 */
export function selectBranch (data) {
  return request({
    url: api.listBranch,
    data: data,
    method: 'post'
  })
}

/**
 * 创建支部
 * @param data
 * @returns {AxiosPromise}
 */
export function addBranch (data) {
  return request({
    url: api.addBranch,
    data: data,
    method: 'post'
  })
}

/**
 * 更新支部
 * @param data
 * @returns {AxiosPromise}
 */
export function updateBranch (data) {
  return request({
    url: api.updateBranch,
    data: data,
    method: 'post'
  })
}

/**
 * 删除支部
 * @returns {AxiosPromise}
 */
export function deleteBranch (data) {
  return request({
    url: api.deleteBranch,
    data: data,
    method: 'post'
  })
}

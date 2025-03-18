import request from './myRequest';

// 登陆
export async function login(data: any) {
  return request(`/user/login/`, {
    method: 'POST',
    data: data,
  });
}

//用户表
// 增加用户
export async function addUser(data: any) {
  return request(`/user/add/`, {
    method: 'POST',
    data: data,
  });
}

// 修改用户
export async function updateUser(data: any) {
  return request(`/user/update/`, {
    method: 'POST',
    data: data,
  });
}

// 修改用户
export async function updatePassword(data: any) {
  return request(`/user/updatePassword/`, {
    method: 'POST',
    data: data,
  });
}

// 查看用户
export async function selectUser() {
  return request(`/user/showAll/`, {
    method: 'GET',
  });
}

// 查询用户
export async function searchUser(data: any) {
  return request(`/user/find/`, {
    method: 'POST',
    data: data,
  });
}

// 查询用户
export async function searchUserById(data: any) {
  return request(`/user/findById/`, {
    method: 'POST',
    data: data,
  });
}

// 删除用户
export async function deleteUser(data: any) {
  return request(`/user/delete`, {
    method: 'POST',
    data: data,
  });
}

//爬虫爬取
export async function spider(data: any) {
  return request(`/classification/spider`, {
    method: 'POST',
    data: data,
  });
}

//聚类
export async function classify(data: any) {
  return request(`/classification/classify`, {
    method: 'POST',
    data: data,
  });
}

export async function getKeywords(data: any) {
  return request(`/classification/getKeywords`, {
    method: 'POST',
    data: data,
  });
}

//检测结果
//查找
export async function selectRecord(data: any) {
  return request(`/record/show/`, {
    method: 'POST',
    data: data,
  });
}

export async function selectNews(data: any) {
  return request(`/record/showNews/`, {
    method: 'POST',
    data: data,
  });
}

export async function deleteRecord(data: any) {
  return request(`/record/delete/`, {
    method: 'POST',
    data: data,
  });
}
import request from "@/units/request";


// 获取相册
export async function queryBlbum(data: any) {
  return request({
      method: "POST",
      url: "/album",
      data,
  });
}

// 添加相册
export async function addAlbum(data: any) {
    return request({
        method: "POST",
        url: "/album/add",
        data,
    });
}

// 删除相册
export async function delAlbum(data: any) {
  return request({
      method: "POST",
      url: "/album/del",
      data,
  });
}

// 设置封面图
export async function setCover(data: any) {
  return request({
      method: "POST",
      url: "/album/set_cover",
      data,
  });
}
import request from "@/units/request";

export const getInfo = (id: number) => request({
  url: '/topic/detail',
  method: 'POST',
  data: { id: +id }
})

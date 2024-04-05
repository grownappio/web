// 将base64转换为blob
export const dataURLtoBlob = (dataurl: string) => {
  const arr: any = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n: number = bstr.length
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 将blod 转为file 类型
export const blobToFile = (theBlob: any, fileName: string) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export const getRandomNum = (min: number, max: number) => {
  var Range = max - min;
  var Rand = Math.random();
  return (min + Math.round(Rand * Range));
}

export function fileSelect({ accept = 'image/*' } = {}) {
  return new Promise<FileList>((resolve) => {
    const input = document.createElement('input')
    input.accept = accept
    input.type = 'file'
    input.onchange = () => input.files && resolve(input.files)
    input.click()
  })
}

// 将图片转化成base64
// export const getBase64Img = (params: {url: string}) => {
//   if (params && params.url) {
//     var image = new Image();
//     image.src = params.url + "?" + Math.random();
//     image.crossOrigin = 'anonymous';
//     image.onload = function () {
//       var canvas = document.createElement("canvas");
//       canvas.width = image.width;
//       canvas.height = image.height;
//       var ctx: any = canvas.getContext("2d");
//       ctx.drawImage(image, 0, 0, image.width, image.height);
//       var ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
//       var dataURL = canvas.toDataURL("image/" + ext);
//       console.log(dataURL);
//       // if (params.callback) {
//       //   params.callback(dataURL)
//       // };
//       return dataURL;
//     }
//   }
// }
import React, { useEffect, useState, useCallback } from 'react';
import { Radio, Slider, message, Button } from 'antd';
import Cropper from 'react-easy-crop';
import increaseImg from "./increase.svg";
import subtractionImg from "./subtraction.svg";
import cropperCloseImg from "./cropper-close.svg";
import { SwapOutlined } from '@ant-design/icons'
import { getToken } from '@/units';
import 'cropperjs/dist/cropper.css';
import { dataURLtoBlob, blobToFile, getRandomNum, fileSelect } from './utils';
import getCroppedImg from './cropImage'

import styles from './index.module.less';
import Appbar from '../Appbar';
export type PropsCropper = {
  onSuccess: (value: string, is_cover: boolean, imgHeight: number) => void;
  url: string;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  aspectRatio?: number;
  autoCropArea?: number;
  height?: string; // 裁切区域高
  width?: string; // 裁切区域宽
  cropWidth?: string; // 裁切框宽
  cropHeight?: string; // 裁切框高
  isCover?: boolean;
  isUserIcon?: boolean; // 个人头像样式不一样
}
const ImageCropper = (props: PropsCropper) => {
  const {
    aspectRatio = 1,
    modalVisible = false,
    setModalVisible,
    onSuccess,
    url,
    isCover = false,
    isUserIcon = false
  } = props;
  const [source, setSource] = useState<string>('');
  const [checkVal, setCheckVal] = useState<boolean>(true);

  const handleOnClickRadio = () => setCheckVal(!checkVal);
  const [loading, setLoading] = useState<boolean>(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const croppedImage: any = await getCroppedImg(
        source,
        croppedAreaPixels
      )
      const blob = dataURLtoBlob(croppedImage);
      const file = blobToFile(blob, `${getRandomNum(1, 99999)}${new Date().getTime()}.png`);
      let _URL = window.URL || window.webkitURL;
      let image = new Image();
      image.src = _URL.createObjectURL(file);
      image.onload = function () {
        const imgHeight = (402 * image.height) / image.width;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const url = `${process.env.API_ROOT}app/file/upload`;
        setLoading(true)
        fetch(url, {
          method: "POST",
          headers: {
            'token': getToken()
          },
          body: formData
        }).then((response) => {
          response.json().then(res => {
            setLoading(false)
            if (res.code === 200) {
              onSuccess && onSuccess(res.data.url, isCover ? true : checkVal, imgHeight);
            } else {
              message.warning('Image upload failed');
            }
          }).catch(() => {
            setLoading(false);
            message.warning('Image upload failed');
          });
        }).catch(() => {
          setLoading(false);
          message.warning('Image upload failed');
        })
      }
    } catch (e) {
      message.error('Image upload failed');
      setLoading(false);
      console.error(e)
    }
  }, [croppedAreaPixels])

  const handleInputChange = async () => {
    const file = (await fileSelect())[0];
    const reader: any = new FileReader();
    reader.onload = () => setSource(reader.result);
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  useEffect(() => {
    if (modalVisible) {
      setSource(url)
    }
  }, [modalVisible])

  if (!modalVisible) {
    return null;
  }

  return (
    <div className={[styles['img-cropper-box'], isUserIcon ? styles['user-icon-cropper-box'] : ''].join(' ')}>
        <Appbar className='text-white !bg-black' title='Upload photo' onBack={() => setModalVisible(false)} />
        <div className='relative w-full flex-1 bg-[#070e16]'>
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={5}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            restrictPosition={true}
          />
        </div>
        <div className='py-40 text-center text-white bg-black'>
          <div className='inline-flex items-center py-6 px-8 b-1 border-white/50 rounded-6' onClick={handleInputChange}>
            <SwapOutlined style={{ marginRight: '5px' }} />
            <span>Change photo</span>
          </div>
          {
            !isCover
            &&
            <div><Radio checked={checkVal} onClick={handleOnClickRadio}>Set as album cover</Radio></div>
          }
          {/* <Button loading={loading} onClick={handleSubmit}>Apply</Button> */}
          <div className='btn-primary mt-32 mx-24 py-14 text-center' onClick={handleSubmit}>Apply</div>
        </div>
    </div>
  )
}

export default ImageCropper;
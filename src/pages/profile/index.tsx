import React, { useRef, useEffect, useState, useMemo } from "react";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import { useData } from "@/reducer";
import ImgPreview from "@/components/ImgPreview";
import ImageCropper from "@/components/ImageCropper";
import Banner from "./compoents/Banner";
import PeosonInfo from "./compoents/PersonInfo";
import LinkList from "./compoents/LinkList";
import Fans from "./compoents/Fans";
import QaAndFavorites from "./compoents/QaAndFavorites";
import bannerBgImg from "@/assets/img/profile/banner/banner-bg.png";
import { getProfile, addAlbum, followPerson, queryBlbum, platformBind } from "./service";
import {setBrowerTabTitle} from '@/utils';
import type { TypeuserInfo } from "./data.d";
import styles from "./index.module.less";
import { useGetList } from "@/hooks/useGetList";
import { useSearchQuerys } from "@/hooks/useSearchQuerys";

const Profile = () => {
  const state = useData();
  const params = useSearchQuerys({ search_sign: 1, is_collect: false, type: 1 })
  const history = useHistory();
  const [isSelf, setIsSelft] = useState<boolean>(false); // 是否是本人
  const headerRef: any = useRef(null);
  const [isCeiling, setIsCeiling] = useState<boolean>(false); // 是否吸顶
  const [userInfo, setUserInfo] = useState<TypeuserInfo>({ id: 0, sex: 1, album_num: 0, fans_num: 0, bgm_pic: bannerBgImg }); // 个人信息数据
  const [cropperVisible, setCropperVisible] = useState<boolean>(false); // 背景上传开关
  const [uploadUrl, setUploadUrl] = useState<string>(''); // 上传图片数据
  const [uploadImgHeight, setUploadImgHeight] = useState<number>(0);
  const [imgList, setImgList] = useState<{ src: string, key: number }[]>([]); // 预览图片列表
  const [previewPndex, setPreviewPndex] = useState<number>(1); // 默认打开预览图片下表
  const [visible, setVisible] = useState<boolean>(false); // 图片预览开关
  const [discardMask, setDiscardMask] = useState<boolean>(false); // 取消推特绑定开关
  const [bannerLoading, setBannerLoading] = useState<boolean>(true); // banner 未加载loading

  const query = useMemo(() => ({ ...params, page: { page_num: 1, page_size: 20 } }), [])
  const aaa = useGetList(query, { url: '/profile/qa', list: e => e, hasMore: e => !!e?.length, numKey: 'page.page_num', sizeKey: 'page.page_size', delay: 600 })

  const subTabList = [
    { value: 1, label: 'Answers' },
    { value: 0, label: 'Questions' }
  ]

  const handleScroll = () => {
    if (window.scrollY >= window.outerHeight) {
      setIsCeiling(true);
    } else {
      setIsCeiling(false);
    }
    if (window.scrollY + window.outerHeight >= document.body.scrollHeight - 150) {
      aaa.loadmore()
    }
  }

  const imgUploadSuccess = (url: string) => {
    let image = new Image();
    image.src = url;
    image.onload = function () {
      const imgHeight = (402 * image.height) / image.width;
      setUploadImgHeight(imgHeight);
    }
    setUploadUrl(url);
    setCropperVisible(true);
  }

  const getImgList = async () => {
    try {
      const result = await queryBlbum({ id: params?.id ? Number(params.id) : 0, need_all: true });
      if (result?.code === 200) {
        setImgList((result?.data || []).map((item: any) => {
          return {
            src: item.Pic,
            key: item.id
          }
        }))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const cropperSuccess = async (url: string, is_cover: boolean) => {
    setCropperVisible(false);
    try {
      const result = await addAlbum({
        addr: uploadUrl,
        cover_addr: url,
        height: uploadImgHeight,
        is_cover
      })
      if (result?.code === 200) {
        message.success('Added successfully');
        const tempUserInfo = JSON.parse(JSON.stringify(userInfo))
        if (is_cover) {
          tempUserInfo.bgm_pic = url;
          bannerImgLoading(url);
        }
        tempUserInfo.album_num = tempUserInfo.album_num + 1;
        tempUserInfo.bgm_pic_id = result?.data;
        setImgList([
          {
            key: result?.data,
            src: url
          },
          ...imgList
        ])
        setUserInfo(tempUserInfo);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const toPhotoAlbum = () => {
    history.push(`/photoAlbum${params.id ? `?id=${params.id}` : ''}`)
  }

  const openPreview = () => { // 打开预览
    for (let i = 0; i < imgList.length; i += 1) {
      if (userInfo.bgm_pic_id === imgList[i].key) {
        setPreviewPndex(i);
        setVisible(true);
        return
      }
    }
    setPreviewPndex(0);
    setVisible(true);
  }

  const bannerImgLoading = (src: string) => {
    setBannerLoading(true);
    let image = new Image();
    image.src = src;
    image.onload = function () {
      setBannerLoading(false);
    }
  }

  const getUserInfo = async () => {
    try {
      const result = await getProfile({ uid: params?.id ? Number(params.id) : '' });
      if (result?.code === 200) {
        setUserInfo({
          ...result?.data
        });
        bannerImgLoading(result?.data?.bgm_pic || bannerBgImg);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const followPeople = async () => {
    const result = await followPerson({ user_id: Number(params.id) });
    if (result?.code === 200) {
      setUserInfo({
        ...userInfo,
        is_follow: !userInfo.is_follow,
        fans_num: userInfo.is_follow ? userInfo.fans_num - 1 : userInfo.fans_num + 1
      })
    }
  }

  const bindingExternalProjects = async (oauthObj: any) => {
    try {
      const platform = Number(sessionStorage.getItem('platform'));
      const result = await platformBind({
        platform,
        token: oauthObj.oauth_token,
        verify: oauthObj.oauth_verifier
      })
      if (result?.code === 200) {
        const tempBindPlatform = userInfo.bind_platform || [];
        tempBindPlatform.push(platform)
        setUserInfo({
          ...userInfo,
          bind_platform: tempBindPlatform
        })
        window.history.pushState({}, '0', `${window.location.origin}${window.location.pathname}#/profile`);
        message.success('Binding successful')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const unbindingPlatform = async (id: number) => {
    try {
      const result = await platformBind({ platform: id, is_delete: true });
      if (result?.code === 200) {
        const tempData = userInfo.bind_platform || [];
        tempData?.splice(tempData.indexOf(id), 1);
        setUserInfo({
          ...userInfo,
          bind_platform: tempData
        })
        setDiscardMask(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getOuathToken = () => {
    const search = window.location.search;
    if (search.indexOf('oauth_token') === -1) return { oauthObj: '', oauth_verifier: '' }
    const tempData = search.split('?')[1].split('&');
    const tempObj: { [key: string]: string } = {}
    tempData.forEach((item) => {
      tempObj[item.split('=')[0]] = item.split('=')[1]
    })
    return tempObj;
  }

  const getBlendData = async () => {
    if (params.id) params.uid = Number(params.id);
    aaa.resetPage(params)
  }

  useEffect(() => {
    getBlendData();
  }, [params.search_sign, params.sortId, params.type, params.id])

  useEffect(() => {
    if (userInfo?.id) {
      const oauthObj: any = getOuathToken();
      if (oauthObj.oauth_token && oauthObj.oauth_verifier) {
        bindingExternalProjects(oauthObj);
      }
    }
  }, [userInfo])

  useEffect(() => {
    // 检查是否是本人
    if ((Number(params?.id) === state?.userInfo?.id) || !params?.id) {
      setIsSelft(true);
    } else {
      setIsSelft(false);
    }
  }, [state?.userInfo?.id, params.id])

  useEffect(() => {
    getUserInfo();
    getImgList();
    getBlendData();
  }, [params.id])

  useEffect(() => {
    if (RegExp('/profile', 'i').test(window.location.hash)) {
      setBrowerTabTitle(`${userInfo.nick_name} (@${userInfo.name}) / Grown`);
    }
  })

  useEffect(() => {
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [Math.random()])

  return (
    <div id="profile-box" className={styles['profile-box']}>
      <div ref={headerRef}>
        <Banner bannerLoading={bannerLoading} openPreview={openPreview} toPhotoAlbum={toPhotoAlbum} isSelf={isSelf} imgUploadSuccess={imgUploadSuccess} bgm_pic={userInfo?.bgm_pic || ''} album_num={userInfo?.album_num || 0} />
        <PeosonInfo followPeople={followPeople} isSelf={isSelf} userInfo={userInfo}>
          <LinkList isSelf={isSelf} discardMask={discardMask} setDiscardMask={setDiscardMask} unbindingPlatform={unbindingPlatform} bind_platform={userInfo?.bind_platform || []} />
          <Fans fans_num={userInfo?.fans_num || 0} following_num={userInfo.following_num || 0} id={params.id} />
        </PeosonInfo>
      </div>
      <QaAndFavorites
        isCeiling={isCeiling}
        mainTabId={params.is_collect}
        setMainTabId={(e) => {
          params.is_collect = e
          // @ts-ignore
          params.type = !e ? 1 : undefined
          params.search_sign = !e ? 1 : 99
        }}
        subTabId={params.search_sign}
        setSubTabId={e => params.search_sign = e}
        sortId={params.type}
        setSortId={e => params.type = e}
        blendLoading={aaa.refreshing}
        loadingMoreFlag={aaa.loadingMore}
        blendHasMoreFlag={aaa.hasMore}
        blendList={aaa.list}
        isSelf={isSelf}
        setBlendList={aaa.setList}
        nickName={userInfo?.nick_name || ''}
        subTabList={!params.is_collect ? subTabList : [{ value: 99, label: 'All' }, ...subTabList]}
      />
      <ImgPreview
        viewAllBtnFlag={true}
        toViewAllImg={toPhotoAlbum}
        imgList={imgList}
        visible={visible}
        previewPndex={previewPndex}
        setPreviewPndex={setPreviewPndex}
        setVisible={setVisible}
      />
      <ImageCropper
        url={uploadUrl}
        onSuccess={cropperSuccess}
        modalVisible={cropperVisible}
        setModalVisible={setCropperVisible}
        aspectRatio={665 / 261}
      />
    </div>
  )
}

export default Profile;
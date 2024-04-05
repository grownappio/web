import React, { useEffect, useState } from "react";
import GrowMask from "@/components/GrowMask";
import styles from "./index.module.less";
import { getLoginUrl } from "../../service";

import linkImg from "@/assets/img/profile/info/link/link.svg";
// import facebookImg from "@/assets/img/profile/info/link/facebook.svg";
// import facebookSelectImg from "@/assets/img/profile/info/link/facebook-select.svg";
// import githubImg from "@/assets/img/profile/info/link/github.svg";
// import githubSelectImg from "@/assets/img/profile/info/link/github.svg";
// import instagramImg from "@/assets/img/profile/info/link/instagram.svg";
// import instagramSelectImg from "@/assets/img/profile/info/link/instagram-select.svg";
// import mediumImg from "@/assets/img/profile/info/link/medium.svg";
// import mediumSelectImg from "@/assets/img/profile/info/link/medium-select.svg";
// import moreImg from "@/assets/img/profile/info/link/more.svg";
// import redditImg from "@/assets/img/profile/info/link/reddit.svg";
// import redditSelectImg from "@/assets/img/profile/info/link/reddit-select.svg";
// import telegramImg from "@/assets/img/profile/info/link/telegram.svg";
// import telegramSelectImg from "@/assets/img/profile/info/link/telegram-select.svg";
// import tiktokImg from "@/assets/img/profile/info/link/tiktok.svg";
// import tiktokSelectImg from "@/assets/img/profile/info/link/tiktok-select.svg";
import twitterImg from "@/assets/img/profile/info/link/twitter.svg";
import twitterSelectImg from "@/assets/img/profile/info/link/twitter-select.svg";
// import youtubeImg from "@/assets/img/profile/info/link/youtube.svg";
// import youtubeSelectImg from "@/assets/img/profile/info/link/youtube-select.svg";

// const linkList = [
//   {
//     id: 1,
//     name: 'Twitter',
//     icon: twitterImg,
//     selectIcon: twitterSelectImg,
//     isLink: false,
//     left: 0,
//     showLeft: 0,
//     path: 'https://twitter.com/home?lang=zh'
//   },
//   {
//     id: 2,
//     name: 'Instagram',
//     icon: instagramImg,
//     selectIcon: instagramSelectImg,
//     isLink: false,
//     left: 38,
//     showLeft: 38,
//     path: 'https://www.instagram.com'
//   },
//   // {
//   //   id: 4,
//   //   name: 'Facebook',
//   //   icon: facebookImg,
//   //   selectIcon: facebookSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 76
//   // },
//   // {
//   //   id: 3,
//   //   name: 'Tiktok',
//   //   icon: tiktokImg,
//   //   selectIcon: tiktokSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 114
//   // },
//   // {
//   //   id: 5,
//   //   name: 'Telegram',
//   //   icon: telegramImg,
//   //   selectIcon: telegramSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 152
//   // },
//   // {
//   //   id: 6,
//   //   name: 'Reddit',
//   //   icon: redditImg,
//   //   selectIcon: redditSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 190
//   // },
//   // {
//   //   id: 7,
//   //   name: 'Medium',
//   //   icon: mediumImg,
//   //   selectIcon: mediumSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 228
//   // },
//   // {
//   //   id: 8,
//   //   name: 'Github',
//   //   icon: githubImg,
//   //   selectIcon: githubSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 266
//   // },
//   // {
//   //   id: 9,
//   //   name: 'Youtube',
//   //   icon: youtubeImg,
//   //   selectIcon: youtubeSelectImg,
//   //   isLink: false,
//   //   left: 76,
//   //   showLeft: 304
//   // },
// ]

export type TypeLinkItem = {
  id: number;
  name: string;
  icon: string;
  selectIcon: string;
  left: number;
  showLeft: number;
  path: string;
}

export type LinkListProps = {
  bind_platform: number[];
  discardMask: boolean;
  isSelf: boolean;
  setDiscardMask: (value: boolean) => void;
  unbindingPlatform: (id: number) => void;
}

const LinkList = (props: LinkListProps) => {
  const { bind_platform, unbindingPlatform, discardMask, setDiscardMask, isSelf } = props;
  // const [isOpen] = useState<boolean>(false);
  const [delTipInfo, setDelTipInfo] = useState<{ id: number, tip?: string }>({ id: 1 });
  const [linkList, setLinkList] = useState<TypeLinkItem[]>([
    {
      id: 1,
      name: 'Twitter',
      icon: twitterImg,
      selectIcon: twitterSelectImg,
      left: 0,
      showLeft: 0,
      path: 'https://twitter.com/home?lang=zh'
    },
    // {
    //   id: 2,
    //   name: 'Instagram',
    //   icon: instagramImg,
    //   selectIcon: instagramSelectImg,
    //   left: 38,
    //   showLeft: 38,
    //   path: 'https://www.instagram.com'
    // }
  ]);

  const toBinding = async (id: number) => {
    try {
      const result = await getLoginUrl({ platform: id, callback_page: 'profile' })
      if (result?.code === 200) {
        sessionStorage.setItem('platform', id.toString())
        window.open(result?.data);
      }
    } catch (err) {
      console.log(err)
    }
  }
  const toPlatForm = (id: number, path: string) => {
    if (bind_platform.indexOf(id) !== -1 && path && isSelf) {
      window.open(path);
    }
    if (bind_platform.indexOf(id) === -1) {
      toBinding(id)
    }
  }
  useEffect(() => {
    if (!isSelf && bind_platform && bind_platform.length) {
      setLinkList(linkList.filter((item: TypeLinkItem) => bind_platform.indexOf(item.id) !== -1));
    }
  }, [isSelf, bind_platform])
  if (!isSelf && !bind_platform.length) {
    return <></>
  }
  return (
    <div className={styles['link-list-box']}>
      <img className="mr-12 w-30 h-30" src={linkImg} alt="" />
      {
        linkList.map((item) =>
          <div className="mr-8 w-22 h-22" key={item.id}>
            <img onClick={() => toPlatForm(item.id, item.path)} src={bind_platform.indexOf(item.id) !== -1 ? item.selectIcon : item.icon} alt="" />
            {
              bind_platform.indexOf(item.id) !== -1 && isSelf
              &&
              <div onClick={() => (setDelTipInfo({ id: item.id, tip: item.name }), setDiscardMask(true))} className={styles['del-btn']}>
                <div />
              </div>
            }
          </div>
        )
      }
      {/* <img style={{
        left: `${isOpen ? 346 / 100 : 118 / 100}rem`,
      }} onClick={() => {
        setIsOpen(!isOpen);
      }} className={styles['more-img']} src={moreImg} alt="" /> */}
      <GrowMask onOk={() => {
        unbindingPlatform(delTipInfo.id);
      }} confirmText="Disconnect" maskFlag={discardMask} title="" tip={`Do you want to disconnect your ${delTipInfo.tip} account?`} setMaskFlag={setDiscardMask} />
    </div>
  )
}

export default LinkList;
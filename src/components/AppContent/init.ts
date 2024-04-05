import { dispatchRef } from "@/reducer";
import { getUserByID } from "@/units/commonService";
import { getAllChain, notificationInfo, topicTipExist } from "./service";
import eventbus from "@/units/eventbus";
import { sessionStorageKey } from "@/components/Wallets/service";

const getUserInfoData = async () => {
  try {
    const result = await getUserByID();
    if (result?.code === 200) {
      const data = result?.data || {};
      dispatchRef.current({
        type: 'changeUserInfo', value: {
          id: data?.id,
          icon: data?.icon,
          nickName: data?.nick_name,
          name: data?.name
        }
      });

      dispatchRef.current({
        type: 'changeEarnPlan', value: data?.earn_plan
      });
    }
  } catch (err) {
    console.log('err', err);
  }
}

const getChainList = async () => {
  try {
    const result = await getAllChain();
    if (result?.code === 200) {
      const tempCurrentChain = result?.data[0];
      if (tempCurrentChain && tempCurrentChain.id) {
        dispatchRef.current({ type: 'changeChainCurrent', value: { id: tempCurrentChain.chain_id, icon: tempCurrentChain?.image_url, name: tempCurrentChain.name, rpcUrl: tempCurrentChain.rpc } });
        sessionStorage.setItem(sessionStorageKey[0], String(tempCurrentChain.chain_id));
        eventbus.emit('defaultChain', tempCurrentChain.chain_id);
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const getNotificationSummary = async () => {
  try {
    const result = await notificationInfo();
    if (result?.code === 200) {
      // 初始化未读数量
      dispatchRef.current({
        type: 'changeNoticeNum',
        value: result?.data?.unread_count
      })
      // 初始化关注的人是否有动态
      dispatchRef.current({
        type: 'changeFollowFlag',
        value: result?.data?.has_follow_user_new_activity
      })
      // 初始化是否有待收货的种子
      dispatchRef.current({
        type: 'changeHarvestableFlag',
        value: result?.data?.has_mature_seeds
      })
    }
  } catch (err) {
    console.log(err);
  }
}

const getTopicTop = async () => {
  try {
    const result = await topicTipExist();
    if (result?.code === 200) {
      dispatchRef.current({ type: 'changeTopicTipSwitch', value: !result?.data?.Closed })
    }
  } catch(err) {
    console.log(err);
  }
}

export const initData = () => {
  // 获取个人信息
  getUserInfoData();
  // 获取链数据
  getChainList();
  // 获取消息通知汇总
  getNotificationSummary();
  // 获取话题提示开关
  getTopicTop();
}

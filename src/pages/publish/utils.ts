import { topicTipClose } from "./service";
import { dispatchRef } from "@/reducer";
export const dataLenTrim = (data?: string) => data?.replace(/\s/g, '').length ?? 0;

export const closeTopicTip = async () => {
  try {
    const result = await topicTipClose();
    if (result?.code === 200) {
      dispatchRef?.current({ type: 'changeTopicTipSwitch', value: false });
    }
  } catch(err) {
    console.log(err);
  }
}
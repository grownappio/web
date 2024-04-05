import React from "react";
import { getPeopleNum } from "@/units/index";
import {useHistory} from "react-router-dom";
export type FansProps = {
  fans_num: number;
  following_num: number;
  id:string;
}
const Fans = (props: FansProps) => {
  const history = useHistory();
  const { fans_num, following_num ,id } = props;
  return (
    <div className="flex items-center mt-16 py-16 bg-text/5 text-center rounded-6">
      <div className="flex-1" onClick={()=>{history.push(`/follow?id=${id}&tab=following`)}}>
        <p className="text-16 font-semibold">{getPeopleNum(following_num)}&nbsp;</p>
        <p className="font-medium opacity-60">Following</p>
      </div>

      <div className="w-1 h-24 bg-gray-500/20"></div>

      <div className="flex-1" onClick={()=>{history.push(`/follow?id=${id}&tab=follows`)}}>
        <p className="text-16 font-semibold">{getPeopleNum(fans_num)}&nbsp;</p>
        <p className="font-medium opacity-60">Followers</p>
      </div>
    </div>
  )
}

export default Fans;
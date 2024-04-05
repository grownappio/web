import React from "react";
import Options from "@/components/Options";
import { CaretDownFilled } from "@ant-design/icons";

const tabList = [
  { value: 0, label: 'All', },
  { value: 1, label: 'Growing', },
  { value: 2, label: 'Matured', },
  { value: 3, label: 'Harvested', },
  { value: 4, label: 'Lost', }
]

export type AllSeedTabProps = {
  value: number;
  onChange: (value: number) => void;
}

const AllSeedTab = (props: AllSeedTabProps) => {
  return (
    <Options className="w-fit mx-12 my-16 active-shadow" value={props.value} onChange={props.onChange} options={tabList} />
  )
}

export default AllSeedTab;
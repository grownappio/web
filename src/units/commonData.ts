import asexualImg from "@/assets/img/profile/info/sex/asexual.svg";
import bisexualityImg from "@/assets/img/profile/info/sex/bisexuality.svg";
import femaleImg from "@/assets/img/profile/info/sex/female.svg";
import maleImg from "@/assets/img/profile/info/sex/male.svg";
import neutralImg from "@/assets/img/profile/info/sex/neutral.svg";

// 社区分类
export const COMMUNITY_CLASS = {
  1: 'Common',
  2: 'Art',
  3: 'Music',
  4: 'Sports',
  5: 'Game',
  6: 'Finance',
  7: 'Culture',
  8: 'Knowledge',
  9: 'Entertainment',
  10: 'Other',
}

// seed by
export const SEED_BY: { [key: string]: string } = {
  1: 'posting the Question',
  2: 'posting the Answer',
  3: 'posting the Comment',
  4: 'sharing the Question',
  5: 'sharing the Answer',
  6: 'inviting friend to answer',
}


// 接口错误码
export const ERRPR_CODE: { [key: string]: string } = {
  '1001': 'Illegal participation',
  '1002': 'Account password error',
  '1003': 'Invalid token',
  '1004': 'Input parameter error',
  '1005': 'User logged off',
  '1006': 'Verification code error',
  '1019': 'Your email address is not in Grown\'s internal test whitelist.',
  '1021': 'Earn Over limit',
  '1022': 'Insufficient water',
  '1031': 'You have already answered the question',
  '1034': 'This question is currently not deletable',
  '1036': 'The question cannot be edited',
  '1037': 'The answer cannot be edited',
  '1038': 'The question does not exist',
  '1039': 'The answer does not exist',
  '1044': 'The topic not exist',
  '1052': 'Your account has been restricted and you can only use the relevant functions of the wallet',
  '9998': 'Server Error',
  '9999': 'Server Error',
  '10011': 'Must be a problem',
  '10012': 'Must be an answer',
  '10013': 'Illegal question and answer id',
  '1027': "Forbid self",
  '1030': "Wallet token expect",
  '2001': "Insufficient balance",
  '2002': "Insufficient gas",
  '2006': "Please bind wallet first",
  '2007': "Invalid password",
  '2008': "Invalid address",
  '2009': "Unmatched wallet address",
  '2010': "Email does not match",
  '1025': "The username already exists",
  '2013': "transfer amount too low"
}

// 接口错误码不弹窗
export const IGNORE_ERRPR_CODE = [
  '1019',
]

// 性别
export const SEX_LIST: { [key: number]: { name: string, icon: string } } = {
  1: {
    name: '男',
    icon: maleImg
  },
  2: {
    name: '女',
    icon: femaleImg
  },
  3: {
    name: '中性',
    icon: neutralImg
  },
  4: {
    name: '双性',
    icon: bisexualityImg
  },
  5: {
    name: '无性别',
    icon: asexualImg
  }
}
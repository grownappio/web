import React, { useContext, useEffect, useRef, useState } from "react";
import { message } from "antd";
import dayjs from 'dayjs'
import { useData } from '@/reducer'
import styles from "./index.module.less";
import { useHistory, Prompt } from "react-router-dom";
import { useAliveController } from 'react-activation';
import { editProfile, getProfile, getUserIcon, userInfo } from "../service";
import Select from "@/components/Select";
import { sexList } from "./data"
import { setBrowerTabTitle } from '@/utils';
import Tag from "@/pages/profile/compoents/Tag";
import returnImg from "@/assets/img/grow/return.svg";
import ellipsis from "@/assets/img/profile/edit/ellipsis.svg";
import plus from "@/assets/img/profile/edit/plus.svg"
// import GrowMask from "@/components/GrowMask";
import ImageCropper from "@/components/ImageCropper";
import defaultIcon from "@/assets/img/profile/edit/default-icon.svg";
import CustomIcon from "@/assets/img/profile/edit/customization.svg"
import headerIconLoadingImg from "@/assets/img/profile/info/header-icon-loading.svg";

import { DataContext } from "@/reducer";
import { fillterAllSpace, formatDate } from "@/units";
import Appbar from "@/components/Appbar";
import { openPopup } from "@/components/_utils/openPopup";
import { fileSelect } from "@/components/ImageCropper/utils";
import Tags from "@/components/Tags";
import Input from "@/components/Input";
import Calendar from "@/components/Calendar";

let dataPicker = {
    today: new Date(),
    config: {
        yearMax: 2023,
        yearMin: 1940,
    },
    year: {},
    yearList: [],
    monthList: [
        { label: 'January', value: 'January' },
        { label: 'July', value: 'July' },
        { label: 'February', value: 'February' },
        { label: 'August', value: 'August' },
        { label: 'March', value: 'March' },
        { label: 'September', value: 'September' },
        { label: 'April', value: 'April' },
        { label: 'October', value: 'October' },
        { label: 'May', value: 'May' },
        { label: 'November', value: 'November' },
        { label: 'June', value: 'June' },
        { label: 'December', value: 'December' }],
    month: {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    },
    monthMap: {
        'January': "01",
        'February': "02",
        'March': "03",
        'April': "04",
        'May': "05",
        'June': "06",
        'July': "07",
        'August': "08",
        'September': "09",
        'October': "10",
        'November': "11",
        'December': "12"
    },
    dayMap: {
        1: "01",
        2: "02",
        3: "03",
        4: "04",
        5: "05",
        6: "06",
        7: "07",
        8: "08",
        9: "09",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "01",
        22: "22",
        23: "23",
        24: "24",
        25: "25",
        26: "26",
        27: "27",
        28: "28",
        29: "29",
        30: "30",
        31: "31",
    },
    init: function () {
        let Year: any = {}
        let tempyearlist = []
        for (let i = this.config.yearMin; i <= this.config.yearMax; i++) {
            tempyearlist.push({ label: i, value: i })
            let Month: any = {
                'January': 0,
                'February': 0,
                'March': 0,
                'April': 0,
                'May': 0,
                'June': 0,
                'July': 0,
                'August': 0,
                'September': 0,
                'October': 0,
                'November': 0,
                'December': 0,
            }
            for (let prop in Month) {
                Month[prop] = this.getDaysInMonth(i, prop)
            }
            Year[i] = Month
        }
        this.year = Year
        // @ts-ignore
        this.yearList = tempyearlist.reverse()
    },
    isLeapYear: function (year: number) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },
    getDaysInMonth: function (year: number, Month: string) {
        switch (Month) {
            case 'January':
                return 31;
            case 'February':
                return this.isLeapYear(year) ? 29 : 28;
            case 'March':
                return 31;
            case 'April':
                return 30;
            case 'May':
                return 31;
            case 'June':
                return 30;
            case 'July':
                return 31;
            case 'August':
                return 31;
            case 'September':
                return 30;
            case 'October':
                return 31;
            case 'November':
                return 30;
            case 'December':
                return 31;
        }
        return 0
    },
    dataParse: function (year: number, month: string, day: number) {
        // @ts-ignore
        let birth: string = year + '-' + this.monthMap[month] + '-' + this.dayMap[day]
        return Date.parse(birth) / 1000
    }
}
let tempIfChangeUserInfo = {}
const EditProfile = () => {
    dataPicker.init()
    const history = useHistory();
    const { clear } = useAliveController();
    const [uInfo, setUInfo] = useState<userInfo>({
        id: 1,
        name: '',
        intro: '',
        nick_name: '',
        birthday: 0,
        sex: 0,
        icon: defaultIcon,
        location: "shanghai",
        expertises: '',
        interests: '',
        can_edit_username: false
    })
    const [imgsList, setImgsList] = useState<string[]>([defaultIcon]);
    const [userIconLoadingFlag, setUserIconLoadingFlag] = useState<boolean>(true);

    const [iconMask, setIconMask] = useState(false)
    const [floatOptions, setFloatOptions] = useState(false)
    const [expertiseTags, setExpertiseTags] = useState<{ label: any, value: any }[]>([])
    const [interestsTags, setInterestsTags] = useState<{ label: any, value: any }[]>([])

    const [currentYear, setCurrentYear] = useState<number>(dataPicker.today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState<string>('June')
    const [currentDay, setCurrentDay] = useState<number>(22)
    const [currentDayList, setCurrentDayList] = useState<{ label: number, value: number }[]>(getDays(dataPicker.today.getFullYear(), 'June'))

    const expertiseRef = useRef<any>()
    const interestsRef = useRef<any>()
    const userIconRef = useRef<any>()

    const select1Ref = useRef<any>()
    const select2Ref = useRef<any>()
    const select3Ref = useRef<any>()
    const select4Ref = useRef<any>()
    const [select1Close, setSelect1Close] = useState(false)
    const [select2Close, setSelect2Close] = useState(false)
    const [select3Close, setSelect3Close] = useState(false)
    const [select4Close, setSelect4Close] = useState(false)



    const [expertiseActive, setExpertiseActive] = useState(false)
    const [interestsActive, setInterestsActive] = useState(false)

    const [expertisePlus, setExpertisePlus] = useState(false)
    const [interestsPlus, setInterestsPlus] = useState(false)


    const [currentInputActive, setCurrentInputActive] = useState<string>('')

    const [currentAlertActive, setCurrentAlertActive] = useState<string>('')

    const [ifIPlus, setIfIPlus] = useState<boolean>(true);
    const [ifEPlus, setIfEPlus] = useState<boolean>(true);

    const [inputNum, setInputNum] = useState({
        name: 0,
        nick_name: 0,
        intro: 0,
        location: 0,
        expertises: 0,
        interests: 0,
    })

    const [canSave, setCanSave] = useState(false)
    const [ifModefyName, setIfModefyName] = useState(false)
    const { dispatch } = useContext<any>(DataContext);
    const { userInfo: info } = useData();

    const initUserInfo = async () => {
        const tempimg = await getUserIcon()
        setImgsList(tempimg?.data)
        const result = await getProfile({ uid: '' })
        const tempUserINfo: userInfo = {
            id: result?.data?.id,
            name: result?.data?.name,
            intro: result?.data?.intro,
            nick_name: result?.data?.nick_name,
            birthday: result?.data?.birthday,
            sex: result?.data?.sex,
            icon: result?.data?.icon,
            location: result?.data?.location,
            expertises: result?.data?.expertises,
            interests: result?.data?.interests,
            can_edit_username: result?.data?.can_edit_username
        }
        setInputNum({
            name: fillterAllSpace(tempUserINfo.name || "")?.length || 0,
            nick_name: fillterAllSpace(tempUserINfo.nick_name).length,
            intro: fillterAllSpace(tempUserINfo.intro).length,
            location: fillterAllSpace(tempUserINfo.location).length,
            expertises: 0,
            interests: 0,
        })
        setUInfo(tempUserINfo)
        tempIfChangeUserInfo = tempUserINfo
        if (tempUserINfo?.expertises.trim() !== '') {
            const tempExpertiseTags = tempUserINfo?.expertises?.split(',').map((item) => {
                return ({ label: item, value: item })
            })
            if (tempExpertiseTags.length >= 3) {
                setIfEPlus(false)
            } else {
                setIfEPlus(true)
            }
            setExpertiseTags(tempExpertiseTags)
        }
        if (tempUserINfo?.interests?.trim() !== '') {
            const tempInterestsTags = tempUserINfo?.interests?.split(',').map((item) => {
                return ({ label: item, value: item })
            })
            if (tempInterestsTags.length >= 3) {
                setIfIPlus(false)
            } else {
                setIfIPlus(true)
            }
            setInterestsTags(tempInterestsTags)
        }
        let dateTemp = new Date(tempUserINfo?.birthday * 1000)
        let Y = dateTemp.getFullYear()
        let M = dateTemp.getMonth() + 1
        let D = dateTemp.getDate()
        // @ts-ignore
        const tempMonth = dataPicker.month[M]
        setCurrentYear(Y)
        setCurrentMonth(tempMonth)
        setCurrentDay(D)
        setCurrentDayList(getDays(Y, tempMonth))
    }

    function selectYearOnchange(value: any) {
        setCurrentYear(value)
        setCurrentDayList(getDays(value, currentMonth))
        // @ts-ignore
        let day = dataPicker.year[value][currentMonth]
        let tempUinfo = { ...uInfo }
        if (currentDay > day) {
            setCurrentDay(day)
            tempUinfo.birthday = dataPicker.dataParse(value, currentMonth, day)
        } else {
            tempUinfo.birthday = dataPicker.dataParse(value, currentMonth, currentDay)
        }
        setUInfo(tempUinfo)
        userInfoCheck(uInfo.sex)
    }

    function selectMonthOnchange(value: any) {
        setCurrentMonth(value)
        setCurrentDayList(getDays(currentYear, value))
        // @ts-ignore
        let day = dataPicker.year[currentYear][value]
        let tempUinfo = { ...uInfo }

        if (currentDay > day) {
            setCurrentDay(day)
            tempUinfo.birthday = dataPicker.dataParse(currentYear, value, day)
        } else {
            tempUinfo.birthday = dataPicker.dataParse(currentYear, value, currentDay)
        }
        setUInfo(tempUinfo)

        userInfoCheck(uInfo.sex)
    }

    function selectDayOnchange(value: any) {
        setCurrentDay(value)
        let tempUinfo = { ...uInfo }
        tempUinfo.birthday = dataPicker.dataParse(currentYear, currentMonth, value)
        setUInfo(tempUinfo)

        userInfoCheck(uInfo.sex)
    }

    function addexpertiseTags() {
        if (expertiseTags.length > 0) {
            if (expertiseTags[expertiseTags.length - 1].value === '') {
                return
            }
            if (expertiseTags.length >= 3) {
                setIfEPlus(false)
                message.warning('Expertise over the limit')
                return
            } else {
                setIfEPlus(true)
            }
        }

        let temptags = [...expertiseTags, { label: '', value: '' }]
        setExpertiseTags(temptags)

        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        temptags?.forEach((item) => {
            if (tempInterest === '') {
                tempInterest = tempInterest + item.value
            } else {
                tempInterest = tempInterest + ',' + item.value
            }
        })
        tempUinfo.expertises = tempInterest
        setUInfo(tempUinfo)

        scrollwToRight()
    }

    function subTags(value: number) {
        const result = expertiseTags.filter((item, index) => {
            return value !== index
        })
        setExpertiseTags(result)

        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        result?.forEach((item) => {
            if (tempInterest === '') {
                tempInterest = tempInterest + item.value
            } else {
                tempInterest = tempInterest + ',' + item.value
            }
        })
        tempUinfo.expertises = tempInterest
        setUInfo(tempUinfo)

        userInfoCheck(uInfo.sex)
        scrollwToRight()
        setIfEPlus(true)
    }

    const poPTag = (type: string) => {
        if (type === 'expertises') {
            let tempTags = [...expertiseTags]
            tempTags.pop()
            setExpertiseTags(tempTags)

            let tempUinfo = { ...uInfo }
            let tempExperise = ''
            tempTags?.forEach((item) => {
                if (tempExperise === '') {
                    tempExperise = tempExperise + item.value
                } else {
                    tempExperise = tempExperise + ',' + item.value
                }
            })
            tempUinfo.expertises = tempExperise
            setUInfo(tempUinfo)
            setIfEPlus(true)
        } else if (type === 'interests') {
            let tempTags = [...interestsTags]
            tempTags.pop()
            setInterestsTags(tempTags)
            let tempUinfo = { ...uInfo }
            let tempInterest = ''
            tempTags?.forEach((item) => {
                if (tempInterest === '') {
                    tempInterest = tempInterest + item.value
                } else {
                    tempInterest = tempInterest + ',' + item.value
                }
            })
            tempUinfo.interests = tempInterest
            setUInfo(tempUinfo)
            setIfIPlus(true)
        }

    }

    function inputObul(value: any, index: number) {
        let temptag = [...expertiseTags]
        if (temptag.length >= 3) {
            setIfEPlus(false)
        } else {
            setIfEPlus(true)
        }
        temptag[index] = { label: value, value: value }
        setExpertiseTags(temptag)

        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        temptag?.forEach((item) => {
            if (item.value.trim() !== '') {
                if (tempInterest === '') {
                    tempInterest = tempInterest + item.value
                } else {
                    tempInterest = tempInterest + ',' + item.value
                }
            }
        })
        tempUinfo.expertises = tempInterest
        setUInfo(tempUinfo)
        setInputNum({
            ...inputNum,
            interests: 0,
            expertises: 0,
        })

        userInfoCheck(uInfo.sex)
        setExpertiseActive(false)
        scrollwToRight()
    }

    function addIntrestTags() {
        if (interestsTags.length > 0) {
            if (interestsTags[interestsTags.length - 1].value === '') {
                return
            }
            if (interestsTags.length >= 3) {
                setIfIPlus(false)
                message.warning('Interests over the limit');
                return
            } else {
                setIfIPlus(true)
            }
        }
        let temptags = [...interestsTags, { label: '', value: '' }]
        setInterestsTags(temptags)
        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        temptags?.forEach((item) => {
            if (tempInterest === '') {
                tempInterest = tempInterest + item.value
            } else {
                tempInterest = tempInterest + ',' + item.value
            }
        })
        tempUinfo.interests = tempInterest
        setUInfo(tempUinfo)
        scrollwToRight()
    }

    function subIntrestTags(value: number) {
        const result = interestsTags.filter((item, index) => {
            return value !== index
        })
        setInterestsTags(result)
        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        result?.forEach((item) => {
            if (tempInterest === '') {
                tempInterest = tempInterest + item.value
            } else {
                tempInterest = tempInterest + ',' + item.value
            }
        })
        tempUinfo.interests = tempInterest
        setUInfo(tempUinfo)

        userInfoCheck(uInfo.sex)
        scrollwToRight()
        setIfIPlus(true)
    }

    function inputOnChange(value: any) {
        setInputNum({
            ...inputNum,
            expertises: value
        })
    }

    function inputIntrestOnChange(value: any) {
        setInputNum({
            ...inputNum,
            interests: value
        })
    }

    function inputIntrestOburl(value: any, index: number) {
        let temptag = [...interestsTags]
        if (temptag.length >= 3) {
            setIfIPlus(false)
        } else {
            setIfIPlus(true)
        }
        temptag[index] = { label: value, value: value }
        setInterestsTags(temptag)

        setInterestsTags(temptag)
        let tempUinfo = { ...uInfo }
        let tempInterest = ''
        temptag?.forEach((item) => {
            if (item.value.trim() !== '') {
                if (tempInterest === '') {
                    tempInterest = tempInterest + item.value
                } else {
                    tempInterest = tempInterest + ',' + item.value
                }
            }

        })
        tempUinfo.interests = tempInterest
        setUInfo(tempUinfo)

        setInputNum({
            ...inputNum,
            interests: 0,
            expertises: 0,
        })
        userInfoCheck(uInfo.sex)
        setInterestsActive(false)

        scrollwToRight()
    }

    function selectOnchange(value: any) {
        let tempUinfo = { ...uInfo }
        tempUinfo.sex = value
        setUInfo(tempUinfo)
        userInfoCheck(value)
    }

    function getDays(year: number, Month: string) {
        // @ts-ignore
        let day = dataPicker.year[year][Month]
        let days = []
        for (let i = 1; i <= day; i++) {
            days.push({ label: i, value: i },)
        }
        return days
    }

    const saveProfile = async () => {
        if (inputNum.name > 25) {
            message.warning('Username over the limit');
            setCurrentAlertActive('name')
            setCanSave(false)
            return
        }
        if (inputNum.nick_name > 25) {
            message.warning('Name over the limit');
            setCurrentAlertActive('nick_name')
            setCanSave(false)
            return
        }
        if (inputNum.intro > 200) {
            message.warning('Bio over the limit');
            setCurrentAlertActive('intro')
            setCanSave(false)

            return
        }
        if (inputNum.location > 25) {
            message.warning('Location over the limit');
            setCurrentAlertActive('location')
            setCanSave(false)
            return
        }
        if (inputNum.expertises > 25) {
            message.warning('Expertise over the limit');
            setCurrentAlertActive('expertises')
            setCanSave(false)
            return
        }
        if (inputNum.interests > 25) {
            message.warning('Interests over the limit');
            setCurrentAlertActive('interests')
            setCanSave(false)
            return
        }


        const tempUserInfo = {
            ...uInfo,
            name: uInfo.can_edit_username ? (ifModefyName ? uInfo.name : undefined) : undefined
        }
        tempIfChangeUserInfo = uInfo;
        await editProfile(tempUserInfo)
        dispatch({
            type: 'changeUserInfo', value: {
                id: tempUserInfo.id,
                icon: tempUserInfo.icon,
                nickName: tempUserInfo.nick_name,
                name: uInfo.name
            }
        })
        clear();
        setTimeout(() => {
            // history.goBack()
        }, 100);
    }

    const chickUserName = () => {
        const reg = new RegExp(/^[a-zA-Z0-9_]*$/g);
        if (!reg.test(uInfo.name || "")) {
            message.warning('Your username can only contain letters, numbers and \'_\'');
            return;
        }
        if ((uInfo?.name?.length || 0) < 5) {
            message.warning('Your username must be longer than 4 characters');
            return;
        }
    }
    //
    const userInfoCheck = (sex: number) => {
        if (uInfo.nick_name.trim() === '' || fillterAllSpace(uInfo.nick_name).length > 25) {
            setCurrentAlertActive('nick_name')
            setCanSave(false)
            message.warning('The nick_name does not comply with the check rule');
            return;
        }
        if (sex === 0) {
            setCurrentAlertActive('sex')
            setCanSave(false)
            return;
        }

        if (uInfo.intro.trim() === '' || fillterAllSpace(uInfo.intro).length > 200) {
            setCurrentAlertActive('intro')
            setCanSave(false)
            message.warning('The intro does not comply with the check rule');
            return
        }

        const reg = new RegExp(/^[a-zA-Z0-9_]*$/g);
        if ((uInfo.name?.trim() === '') || ((uInfo.name?.trim()?.length || 0) < 5) || fillterAllSpace(uInfo.name || '').length > 25 || (!reg.test(uInfo.name || ""))) {
            setCurrentAlertActive('name')
            setCanSave(false)
            message.warning('The name does not comply with the check rule');
            return;
        }


        if (fillterAllSpace(uInfo.location).length > 25) {
            setCurrentAlertActive('location')
            setCanSave(false)
            message.warning('The location does not comply with the check rule');
            return
        }

        setCurrentAlertActive('')
        setCanSave(true)
    }

    const onChange = (e: any, attriBute: string) => {
        let tempUinfo = { ...uInfo }
        switch (attriBute) {
            case 'name':
                tempUinfo.name = e.target.value
                setInputNum({
                    ...inputNum,
                    name: fillterAllSpace(e.target.value || '')?.length || 0
                })
                setIfModefyName(true)
                break;
            case 'intro':
                tempUinfo.intro = e.target.value
                setInputNum({
                    ...inputNum,
                    intro: fillterAllSpace(e.target.value).length
                })
                break;
            case 'nick_name':
                tempUinfo.nick_name = e.target.value
                setInputNum({
                    ...inputNum,
                    nick_name: fillterAllSpace(e.target.value).length
                })
                break;
            case 'expertises':
                tempUinfo.expertises = e.target.value
                setInputNum({
                    ...inputNum,
                    expertises: tempUinfo.expertises.length
                })
                break;
            case 'interests':
                tempUinfo.interests = e.target.value
                setInputNum({
                    ...inputNum,
                    interests: tempUinfo.interests.length
                })
                break;
            case 'location':
                tempUinfo.location = e.target.value
                setInputNum({
                    ...inputNum,
                    location: fillterAllSpace(e.target.value).length
                })
                break;
        }
        setUInfo(tempUinfo)
        if (attriBute === 'nick_name') {
            if ((fillterAllSpace(e.target.value) === '' || fillterAllSpace(e.target.value).length > 25)) {
                setCurrentAlertActive('nick_name')
                setCanSave(false)
                return;
            }
        } else {
            if ((fillterAllSpace(uInfo.nick_name) === '' || inputNum.nick_name > 25)) {
                setCurrentAlertActive('nick_name')
                setCanSave(false)
                return;
            }
        }
        if (attriBute === 'sex') {
            if (e.target.value === 0) {
                setCurrentAlertActive('sex')
                setCanSave(false)
                return;
            }
        } else {
            if (uInfo.sex === 0) {
                setCurrentAlertActive('sex')
                setCanSave(false)
                return;
            }
        }

        if (attriBute === 'intro') {
            if ((fillterAllSpace(e.target.value) === '' || fillterAllSpace(e.target.value).length > 200)) {
                setCurrentAlertActive('intro')
                setCanSave(false)
                return
            }
        } else {
            if ((fillterAllSpace(uInfo.intro) === '' || inputNum.intro > 200)) {
                setCurrentAlertActive('intro')
                setCanSave(false)
                return
            }
        }
        const reg = new RegExp(/^[a-zA-Z0-9_]*$/g);
        if (attriBute === 'name') {
            if (((fillterAllSpace(e.target.value) === '') || ((fillterAllSpace(e.target.value)?.length || 0) < 5 || (fillterAllSpace(e.target.value)?.length || 0) > 25) || (!reg.test(e.target.value || "")))) {
                setCurrentAlertActive('name')
                setCanSave(false)
                return;
            }
        } else {
            if (((fillterAllSpace(uInfo.name || '') === '') || (inputNum.name < 5 || inputNum.name > 25) || (!reg.test(uInfo.name || "")))) {
                setCurrentAlertActive('name')
                setCanSave(false)
                return;
            }
        }

        if (attriBute === 'location') {
            if (fillterAllSpace(e.target.value).length > 25) {
                setCurrentAlertActive('location')
                setCanSave(false)
                return
            }
        } else {
            if ((inputNum.location) > 25) {
                setCurrentAlertActive('location')
                setCanSave(false)
                return
            }
        }

        setCurrentAlertActive('')
        setCanSave(true)
    }


    const [cropperVisible, setCropperVisible] = useState<boolean>(false);

    const [uploadUrl, setUploadUrl] = useState<string>('');

    const uploadAvatar = async () => {
        const files =  await fileSelect()
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e: any) => {
            setUploadUrl(e.target?.result);
            setCropperVisible(true);
        }
    }

    const cropperSuccess = async (url: string, is_cover: boolean, imgHeight: number) => {
        setCropperVisible(false);
        let tempUinfo = { ...uInfo }
        tempUinfo.icon = url
        setUInfo(tempUinfo)
        userInfoCheck(uInfo.sex)

        setFloatOptions(false)
        setIconMask(false)
    }

    const scrollwToRight = () => {
        setTimeout(() => {
            interestsRef.current.scrollLeft = interestsRef.current.scrollWidth;
            expertiseRef.current.scrollLeft = expertiseRef.current.scrollWidth;
        }, 100)
    }

    useEffect(() => {
        if (uInfo.icon) {
            setUserIconLoadingFlag(true);
            let image = new Image();
            image.src = uInfo.icon;
            image.onload = function () {
                setUserIconLoadingFlag(false);
            }
        }
    }, [uInfo.icon])

    useEffect(() => {
        initUserInfo()
        scrollwToRight()
        setTimeout(() => {
            userIconRef?.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 200)

    }, [])

    useEffect(() => {
        if (RegExp('/editProfile', 'i').test(window.location.hash)) {
            setBrowerTabTitle(`${info.nickName} (@${info.name}) / Grown`);
        }
    })

    function chooseAvatar() {
        const popup = openPopup((
            <>
                <div className="mb-28 text-18 text-center font-semibold">Choose Avatar</div>
                <div className="flex justify-center items-center h-80 b-1 border-dashed border-text/20 rounded-8" onClick={() => {uploadAvatar(); popup.close()}}>
                    <img className="w-30 h-30" src={CustomIcon} />
                </div>
                <div className="my-20 b-b-1 border-text/8"></div>
                <div className="grid grid-cols-5 gap-12">
                    {imgsList.map(icon => (
                        <img key={icon} className="w-60 h-60 rounded-8" src={icon} onClick={() => {setUInfo(e => ({ ...e, icon })); popup.close()}} />
                    ))}
                </div>
            </>
        ), { bodyClassName: 'py-32 px-16', closeOnMaskClick: true, showClose: true })
    }

    return (
        <div className={styles['edit-box']} onClick={(e) => {
            e.stopPropagation()

            if (select2Close) {
                setSelect2Close(false)
            } else {
                if (!select2Ref?.current?.contains(e.target)) {
                    setSelect2Close(true)
                }

            }

            if (select3Close) {
                setSelect3Close(false)
            } else {
                if (!select3Ref?.current?.contains(e.target)) {
                    setSelect3Close(true)
                }
            }

            if (select4Close) {
                setSelect4Close(false)
            } else {
                if (!select4Ref?.current?.contains(e.target)) {
                    setSelect4Close(true)
                } 
            }

            if (!userIconRef.current?.contains(e.target)) {
                setFloatOptions(false)
                setIconMask(false)
            }

        }}>
            <Appbar title='Edit profile' right={<button className="btn-primary py-5" onClick={saveProfile}>Save</button>} />

            <div className={styles['user-body']}>
                <div className={'w-80 h-80 my-20 mx-auto rounded-full overflow-hidden'} ref={userIconRef}>
                    <img src={uInfo.icon} alt={''} onClick={chooseAvatar} />
                </div>
                <div className={styles['edit-user-info']}>
                    <div className={styles['input-box']}>
                        <div className={styles['input-title']}>
                            <div className={styles['required']}>
                                *<span>UserName</span>
                            </div>
                            <div className={styles['alert']}>
                                <div className={styles['content']}>
                                    Username is a unique certificate for your account, can only be changed once within 90 days.
                                </div>
                            </div>
                        </div>

                        <div className={styles['input-content']}
                            style={{
                                outline: (currentInputActive === "name" && uInfo.can_edit_username) ?
                                    '1px solid #34D026' : (currentAlertActive === "name" ? '1px solid red' : ''),
                                background: !uInfo.can_edit_username ? 'rgba(17, 36, 56, 0.04)' : ''
                            }}>
                            <input
                                style={{ background: "transparent", color: !uInfo.can_edit_username ? 'rgba(17, 36, 56, 0.6)' : '' }}
                                readOnly={!uInfo.can_edit_username}
                                onFocus={() => { setCurrentInputActive("name") }}
                                onBlur={() => { setCurrentInputActive(''); chickUserName(); userInfoCheck(uInfo.sex); }}
                                value={uInfo.name}
                                type={"text"}
                                onChange={(e) => { onChange(e, "name") }}
                            ></input>
                            <span className={styles['input-limit']}
                                style={{ color: !uInfo.can_edit_username ? 'rgba(17, 36, 56, 0.6)' : '' }}
                            >{inputNum.name}<span> / 25</span></span>
                        </div>

                    </div>
                    <div className={styles['input-box']}>
                        <div className={styles['input-title']}>
                            <div className={styles['required']}>
                                *<span>Name</span>
                            </div>
                        </div>

                        <div className={styles['input-content']}
                            style={{ outline: currentInputActive === "nick_name" ? '1px solid #34D026' : (currentAlertActive === "nick_name" ? '1px solid red' : '') }}>
                            <input
                                onFocus={() => { setCurrentInputActive("nick_name") }}
                                onBlur={() => { setCurrentInputActive(''); userInfoCheck(uInfo.sex) }}
                                value={uInfo.nick_name}
                                type={"text"}
                                onChange={(e) => { onChange(e, "nick_name") }} />
                            <span className={styles['input-limit']}>{inputNum.nick_name}<span> / 25</span></span>
                        </div>

                    </div>
                    <div className={styles['input-box']}>
                        <div className={styles['input-title']}>
                            <div className={styles['required']}>
                                *<span>Sex</span>
                            </div>
                        </div>

                            <Select
                                className='h-48 mt-10 mb-18'
                                close={select1Close}
                                zIndex={23}
                                defaultValue={uInfo.sex}
                                listCap={5}
                                height={47}
                                list={sexList}
                                onChange={selectOnchange} />
                    </div>
                    <div className={styles['input-box']}>
                        <div className={styles['input-title']}>
                            <div className={styles['required']}>
                                *<span>Bio</span>
                            </div>
                        </div>

                        <div className={styles['input-content'] + ' !h-96'} style={{ outline: currentInputActive === "intro" ? '1px solid #34D026' : (currentAlertActive === "intro" ? '1px solid red' : '') }}>
                            <textarea
                                onFocus={() => { setCurrentInputActive("intro") }}
                                onBlur={() => { setCurrentInputActive(''); userInfoCheck(uInfo.sex) }}
                                value={uInfo.intro}
                                onChange={(e) => { onChange(e, "intro") }} />
                            <span className={styles['input-limit']}>{inputNum.intro}<span> / 200</span></span>
                        </div>
                    </div>
                </div>
                <div className={styles['edit-extra-info']}>
                    <div className={styles['title'] + ' -mb-16'}>
                        More information to meet more people
                    </div>
                    <div className={styles['bank-birthday']}>Birthday</div>
                    {/* @ts-ignore */}
                    <Calendar value={new Date(uInfo.birthday * 1000)} selectionMode="single" onChange={date => setUInfo(e => ({ ...e, birthday: +date / 1000 }))}>
                        <Input value={dayjs(uInfo.birthday * 1000).format('YYYY/MM/DD')} placeholder="xxxx/xx/xx" />
                    </Calendar>

                    <div className={styles['bank-location']}>Location</div>

                    <div className={styles['location']} style={{ outline: currentInputActive === "location" ? '1px solid #34D026' : (currentAlertActive === "location" ? '1px solid red' : '') }}>
                        <input onFocus={() => { setCurrentInputActive("location") }}
                            onBlur={(e) => {
                                setCurrentInputActive(''); userInfoCheck(uInfo.sex)
                            }}
                            className={styles['input-content']}
                            value={uInfo.location}
                            onChange={(e) => { onChange(e, "location") }} />
                        <span className={styles['input-limit']}>{inputNum.location}<span> / 25</span></span>
                    </div>

                    <div className={styles['bank-expertise']}>Expertise</div>
                    <span className={styles['alert']}>Currently display up to three expertise</span>
                    <Tags className="mt-16 overflow-auto" value={uInfo.expertises.split(',').filter(e => e)} onChange={val => setUInfo(e => ({ ...e, expertises: val.join(',') }))} addable closable />

                    <div className={styles['bank-expertise']}>Interests</div>
                    <span className={styles['alert']}>Currently display up to three interests</span>
                    <Tags className="mt-16 overflow-auto" value={uInfo.interests.split(',').filter(e => e)} onChange={val => setUInfo(e => ({ ...e, interests: val.join(',') }))} addable closable />
                </div>
            </div>
            <Prompt
                when={uInfo !== tempIfChangeUserInfo}
                message={(location, action) => {
                    return JSON.stringify({
                        action,
                        location,
                        curHref: '/editProfile',
                        message: "This can't be undone and you'll lose your changes.",
                    });
                }}
            />
            <ImageCropper autoCropArea={0.85}
                height="3rem"
                width="3rem"
                cropWidth="2.4rem"
                cropHeight="2.4rem"
                isUserIcon={true}
                isCover={true}
                url={uploadUrl}
                onSuccess={cropperSuccess}
                modalVisible={cropperVisible}
                setModalVisible={setCropperVisible}
                aspectRatio={104 / 104} />
        </div>
    )
}

export default EditProfile;
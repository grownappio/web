import {setBrowerTabTitle, getHashParams} from '../utils';

const renderTextOfEarn = () => 'Earn / Grown';

const renderTextOfAssets = () => 'Assets / Grown';

const renderTextOfAddQuestion = () => 'Add question / Grown';

const renderTextOfAnswerQuestions = () => 'Answer questions / Grown';

const renderTextNotice = () => 'Notifications / Grown';

const renderTextOfAnswerDetail = (search: string) => () => {
    const {id} = getHashParams(search);

    return 'Answer #' + id + ' / Grown';
}

const renderTextOfQuestionDetail = (search: string) => () => {
    const {id} = getHashParams(search);

    return 'Question #' + id + ' / Grown';
}

const renerTextOfSearch = (search: string) => () => {
    const {key} = getHashParams(search);

    return 'Search: ' + window.decodeURI(key) + '  / Grown'
}

const renderTextOfAlbum = () => 'Album / Grown';

export const navigateOnChange = (pathname: string, search: string) => {
    // 其它未列出路由，tab默认显示Grown - Earn in a growing social
    const tilteNameMaps = [
        {test: ['/earn', '/allSeeds'], showText: renderTextOfEarn},
        // {test: ['/profile'], showText: () => {}}, 在组件中设置
        // {test: ['/editProfile'], showText: renderTextOfEditProfile}, 在组件中设置
        {test: ['/wallet', '/transfer', '/assetSend', '/spendingRecord', '/walletRecord'], showText: renderTextOfAssets},
        {test: ['/addQuestion', '/addQuestionNew'], showText: renderTextOfAddQuestion},
        {test: ['/answerQuestions'], showText: renderTextOfAnswerQuestions},
        {test: ['/growDetail'], showText: renderTextOfAnswerDetail(search)}, // 这里是通过打开新的浏览器窗口无法被检测，需在当前组件中设置
        {test: ['/questionDetail'], showText: renderTextOfQuestionDetail(search)}, // 这里是通过打开新的浏览器窗口无法被检测，需在当前组件中设置
        {test: ['/growSearch'], showText: renerTextOfSearch(search)},
        {test: ['/notice'], showText: renderTextNotice}, // 在组件中设置
        {test: ['/photoAlbum'], showText: renderTextOfAlbum}
    ]

    const matched = tilteNameMaps.find(item => item.test.find(reg => RegExp(reg, 'i').test(pathname)));
    if (matched) {
        const text = matched.showText();
        setBrowerTabTitle(text);
    } else {
        setBrowerTabTitle('Grown - Earn in a growing social network');
    }
} 
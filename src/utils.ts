export const setBrowerTabTitle = (text: string) => {
    const titleDom = document.getElementsByTagName('title')[0];

    if (text && titleDom) {
        titleDom.innerText = text;
    }
}

export const getHashParams = (query?: string): any => {
    const queryStr = (query || window.location.hash).split('?')[1];
    if (!queryStr) {
        return {};
    }

    const keyAndVals = queryStr.split('&');

    return keyAndVals.reduce((acc, cur) => {
        const keyAndVal = cur.split('=');
        const key = keyAndVal[0];
        const val = keyAndVal[1];

        return ({
            ...acc,
            [key]: val,
        })
    }, {})
}

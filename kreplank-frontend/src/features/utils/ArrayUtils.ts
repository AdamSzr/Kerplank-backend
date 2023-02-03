
export function replaceItemInArray<T>(array: T[], element: T, prediction: (item: T) => boolean):T[] {

    const elementExists = array.findIndex(prediction)
    if (elementExists === -1)
        throw Error("Cannot replace element if he does not exist in array")

    const beforeIndex = array.slice(0, elementExists)
    const afterIndex = array.slice(elementExists + 1)


    return [...beforeIndex, element, ...afterIndex]
}



export default 1

export function formatDate(date: string):string {
    let tmpDate = new Date(date);

    return tmpDate.getHours() + ":" + 
        tmpDate.getMinutes() + " " +
        tmpDate.getFullYear() + "-" +
        tmpDate.getMonth()+1 + "-" +
        tmpDate.getDate();
}



export default 1
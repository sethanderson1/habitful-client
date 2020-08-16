import axios from 'axios';
import config from '../config';



export const normalizeAxiosError = (error) => {
    const status = error.response && error.response.status
    let msg = 'There was an error'
    let HTTPStatusCode = 'UNKNOWN'
   
    if (status) {
        HTTPStatusCode = status
        switch (status) {
            case 400:
                msg = 'Invalid credentials' //i18n
                break;
            case 401:
                msg = 'You need to login'
                break;
            case 403:
                msg = 'Forbidden'
                break;
            default:
                break;
        }
        HTTPStatusCode = HTTPStatusCode
    } else {
        msg = 'No connection'
        let HTTPStatusCode = 'NO_CONNECTION'
    }
    const ret = new Error(msg)
    ret.HTTPStatusCode = HTTPStatusCode
    return ret
}

const HabitRecordsService = {
    async reqHeaders() {
        const authToken = localStorage.getItem('authToken')
        return {
            headers: {
                "authorization": `bearer ${authToken}`
            }
        }
    },
    async getHabitRecords() {
        try {
            const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios.get(url, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            console.log('err', err)
            // return err;
        }
    },
    // async getHabitRecordsByHabitId() {
    //     try {
    //         const url = `${config.API_ENDPOINT}/habit-records`
    //         const res = await axios.get(url, await this.reqHeaders())
    //         const resHabitRecords = res.data;
    //         return resHabitRecords;
    //     } catch (err) {
    //         console.log('err', err)
    //     }
    // },
    async postHabitRecord(newHabitRecord) {
        try {
            const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios
                .post(url, newHabitRecord, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            // console.log('err', err)
        }
    },
    async getHabitRecordsById(id) {
        try {
            const url = `${config.API_ENDPOINT}/habit-records/record/${id}`
            const res = await axios.get(url, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            // console.log('err', err)
        }
    },
    async deleteHabitRecord(id) {
        try {
            const url = `${config.API_ENDPOINT}/habit-records/record/${id}`
            const res = await axios.delete(url, await this.reqHeaders())
            const deletedRecord = res.data;
            return deletedRecord;
        } catch (err) {
            // console.log('err', err)
        }
    }
}

export default HabitRecordsService;
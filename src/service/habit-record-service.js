import axios from 'axios';
import config from '../config';
import normalizeAxiosError from './normalizeAxiosError';


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
        console.log('HabitsRecordsService.getHabitRecords() ran')

        try {
            // todo: change back just testing
            // const url = `${config.API_ENDPOINT}/invalid-route`

            const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios.get(url, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            console.log('normalizedError', normalizedError)
            console.log('err', err)
            return normalizedError
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
        console.log('HabitsRecordsService.postHabitRecord() ran')
        try {
              // todo: change back just testing
            const url = `${config.API_ENDPOINT}/invalid-route`
            // const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios
                .post(url, newHabitRecord, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            console.log('normalizedError', normalizedError)
            console.log('err', err)
            return normalizedError        }
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
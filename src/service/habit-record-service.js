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
        // console.log('HabitsRecordsService.getHabitRecords() ran')
        try {
            const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios.get(url, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    },
    async postHabitRecord(newHabitRecord) {
        // console.log('HabitsRecordsService.postHabitRecord() ran')
        try {
            const url = `${config.API_ENDPOINT}/habit-records`
            const res = await axios
                .post(url, newHabitRecord, await this.reqHeaders())
            const resHabitRecords = res.data;
            return resHabitRecords;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    },
    async deleteHabitRecord(id) {
        try {
            const url = `${config.API_ENDPOINT}/habit-records/record/${id}`
            const res = await axios.delete(url, await this.reqHeaders())
            const resDeletedRecord = res;
            // console.log('resDeletedRecord', resDeletedRecord)
            return resDeletedRecord;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    }
}

export default HabitRecordsService;
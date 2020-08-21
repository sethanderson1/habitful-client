import axios from 'axios';
import config from '../config';
import normalizeAxiosError from './normalizeAxiosError';

const HabitsService = {
    async reqHeaders() {
        const authToken = localStorage.getItem('authToken')
        return {
            headers: {
                "authorization": `bearer ${authToken}`
            }
        }
    },
    async getHabits() {
        try {
            console.log('HabitsService.getHabits() ran')
            const url = `${config.API_ENDPOINT}/habits`;
            const res = await axios
                .get(url, await this.reqHeaders())
            const resHabits = res.data;
            return resHabits;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    },
    async postHabit(newHabit) {
        try {
            const url = `${config.API_ENDPOINT}/habits`
            const res = await axios
                .post(url, newHabit, await this.reqHeaders())
            const resHabits = res.data;
            return resHabits;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    },
    async getHabitById(id) {
        try {
            const url = `${config.API_ENDPOINT}/habits/${id}`
            const res = await axios
                .get(url, await this.reqHeaders())
            const resHabit = res.data;
            return resHabit;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)

            return normalizedError
        }
    },
    async updateHabit(newHabitFields, id) {
        try {
            const url = `${config.API_ENDPOINT}/habits/${id}`
            const res = await axios
                .patch(url, newHabitFields, await this.reqHeaders())
            const updatedHabit = res.data;
            return updatedHabit;
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    },
    async deleteHabit(id) {
        try {
            const url = `${config.API_ENDPOINT}/habits/${id}`
            await axios
                .delete(url, await this.reqHeaders())
        } catch (err) {
            const normalizedError = normalizeAxiosError(err)
            return normalizedError
        }
    }
}

export default HabitsService
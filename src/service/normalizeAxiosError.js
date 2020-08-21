
    const normalizeAxiosError = (error) => {
    const status = error.response && error.response.status
    let msg = 'There was an error'
    let HTTPStatusCode = 'UNKNOWN'

    if (status) {
        HTTPStatusCode = status
        switch (status) {
            case 400:
                msg = 'Invalid credentials'
                break;
            case 401:
                msg = 'You need to login'
                break;
            case 403:
                msg = 'Forbidden'
                break;
            case 404:
                msg = 'Not found'
                break;
            default:
                break;
        }
    } else {
        msg = 'No connection'
        HTTPStatusCode = 'NO_CONNECTION'
    }
    const ret = new Error(msg)
    ret.HTTPStatusCode = HTTPStatusCode
    return ret
}

export default normalizeAxiosError;
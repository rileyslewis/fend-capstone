const localNodeEnv = () => {
    if (process.env.NODE_ENV == 'development') {
        return 'http://localhost:3000';
    }
    return '';
};

const gapDays = (dt1, dt2) => {
    let difference = dt2.getTime() - dt1.getTime();
    return difference / (1000 * 3600 * 24);
};

const presentDate = (inputDate = 0) => {
    let newDate = new Date().addDays(inputDate);
    let month = newDate.getMonth();
    if (month < 10) {
        month = `0${month + 1}`;
    } else month++;
    let date = newDate.getDate();
    if (date < 10) date = `0${date}`;
    return `${newDate.getFullYear()}-${month}-${date}`;
};

const errorMessages = () => {
    let errorsEls = document.getElementById('error-info');
    errorsEls.innerHTML = '';
    errorsEls.style.display = 'none';
};

const errorHandler = errorMessage => {
    let errorsEls = document.getElementById('error-info');
    errorsEls.innerHTML = errorMessage;
    errorsEls.style.display = 'block';
};

export { errorHandler, errorMessages, presentDate, gapDays, localNodeEnv }
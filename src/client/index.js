// Js
import { handleSubmit } from './js/app.js';


// .addEventListeners go here. 
document.querySelector('#submit').addEventListener('click', () => {
    event.preventDefault();
    const date = document.querySelector('#departure-date').value;
    const city = document.querySelector('#travel-location').value;

    const currentDate = new Date().toJSON().slice(0, 10);
    if (city == '' || date == '') {
        alert('Please make sure dates of departure, destination are correct.');
    } else if (date < currentDate) {
        alert('Departure dates cannot be input before present time.')
    } else {
        handleSubmit(city);
    }
});



import './styles/style.scss'
import './styles/footer.scss'
import './styles/header.scss'
import './styles/main.scss'

export { handleSubmit }
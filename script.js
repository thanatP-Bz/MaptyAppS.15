'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


class workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;//km
        this.duration = duration;//minute
    }
};

class Running extends workout { 
    constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calPace();
  }

  calPace() {
      //min/km
      this.pace = this.duration / this.distance;
      return this.pace;
  }
};


class Clcling extends workout{
    constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }

  calSpeed() {
      //km/h
      this.speed = this.duration / this.duration;
      return this.speed;
  }
};

/* const run1 = new Running([39, -12], 5.2, 24, 178);
const cycling1 = new Clcling([39, -12], 45, 35, 278);
console.log(run1, cycling1); */
//////////Application Architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class App {
    #map
    #mapEvent

    constructor () {
        this.workout = [];
        this._getPosition();

        form.addEventListener('submit', this._newWorkout.bind(this));
        
        inputType.addEventListener('change', this._toggleElevationField);
    }

    _getPosition() {
        if (navigator.geolocation) 
    navigator.geolocation.getCurrentPosition (this._loadMap.bind(this),function() {
    alert('could not get your location');
      }
    );
 }

_loadMap(position) {
    const {latitude, longitude} = position.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));///it comes from the leavelet library

}

_showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
}

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
    const validInputs = (...inputs) =>
    inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => 
    inputs.every(inp => inp > 0);

     e.preventDefault();
     console.log(this);

     //get data from form
     const type = inputType.value;
     const distance = +inputDistance.value;
     const duration = +inputDuration.value;
     const {lat,lng} = this.#mapEvent.latlng;

     //check if data is valid

     //if workout running, create running object
     if(type === 'running') {
         const cadence = +inputCadence.value;
         //check the value
        if(!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
        return alert('Input should be a positive numbers');

        const workout = new Running([lat, lng], distance, duration, cadence);
     }
     //if workout cycling/ crete cycling object
     if(type === 'cycling') {
        const elevation = +inputElevation.value;
        if(!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
        return alert('Input should be a positive numbers');
    }
     //add new object to workout array

     //render on map as a maker
      L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup
      (L.popup({
          maxWidth: 250, 
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup'
      }))
      .setPopupContent('running')
      .openPopup();

     //render a new workout on the list

     //hide the form + clear input fields
      inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
      //display marker
    }
};


const app = new App();


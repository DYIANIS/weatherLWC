import { LightningElement, track, wire } from 'lwc';
import getWeather from '@salesforce/apex/WeatherController.getWeather';
import getForecasts from '@salesforce/apex/MyDataTableLWC.getForecasts';

const columns = [{
        label: 'Date',
        fieldName: 'Date__c'
    },
    {
        label: 'Time',
        fieldName: 'Time__c',
        type: 'date',
        typeAttributes: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        },
        sortable: false
    },
    {
        label: 'Temperature ℃',
        fieldName: 'Temperature__c'
    },
    {
        label: 'Weather_Massage',
        fieldName: 'Weather_Massage__c'
    }
];

export default class DataTableComponent extends LightningElement {
    @track city = '';
    cityName = '';
    iconWeahter = '';
    @track temperature = '';
    error;

    @track columns = columns;
    @wire(getForecasts, { cityName: '$cityName' }) parameters;

    onCityChange(event) {
        this.city = event.target.value;
    }

    getTemp(event) {
        if (this.city != null || this.city != '') {
            getWeather({ city: this.city })
                .then(result => {
                    this.cityName = this.city;
                    let arr = result.split('|');
                    this.temperature = arr[0];
                    this.iconWeahter = 'http://openweathermap.org/img/wn/' + arr[1] + '@2x.png';
                })
                .catch(error => {
                    this.cityName = '';
                    this.temperature = '';
                    this.iconWeahter = '';
                    this.error = error;
                });
        } else {
            alert("Please Enter City");
        }
    }
}
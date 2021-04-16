
import { useEffect, useState } from 'react';

import $ from 'jquery';
/**
 * Takes an object or array of objects, and convert's the keys into an array of Title Heading Formatted Strings. The heading array maintains the same order of the object shape
 * @param {* object or array of objects passed in} object 
 */
export function useObjectKeysAsHeadings(object){
    var headers = []
    console.log(object)
    // determine if the object value is undefined or empty
    if(object !== undefined && object.length !== 0){
        // make sure to extract an object fom the object or array of objects
        const tempObj = Array.isArray(object) ? object[0] : object;
        //map the keys to a string value that modifes the camel case keys into title headings
        const tempArr = [...Object.keys(tempObj)]
        headers = tempArr.map((key)=>{
            return key.replace( /([A-Z])/g, " $1" ).replace(/^./, function(str){ return str.toUpperCase(); });
        })
        return headers
    }
    console.log('falsy value sent to useObjectKeysAsHeadings');
    return headers
    
}


/**
 * same as use state except it calls setState after a specified delay time
 * @param {*} ms - time of the delay
 * @param {*} initialState inital value for state
 */
export function useInputWithTimeout(ms, initialState){
    const [state, setState] = useState(initialState);
    var timeout = 0;
    function onChangeFunc (event){      
        clearInterval(timeout);
        timeout = setTimeout(()=>{
            setState(event.target.value)
        },ms)
    }
   return [state, onChangeFunc];
}

/**
 * gets the users location and outputs the users location, whether or not the user allowed location services, and the feedback message.
 */
export function useNavigator(){
    const [userLocation, setUserLocation] = useState(null);
    const [feedBack, setFeedBack] = useState('');
    const [allowed, setAllowed] = useState(null);
    //set user location, set allowed to true, and set feeback message to a success message
    function success(position){
        setUserLocation({lat: position.coords.latitude, lng: position.coords.longitude});
        setFeedBack('Successfully got user\'s location');
        setAllowed(true);
    }
    //set error feedback on error
    function fail(error){  
        switch(error.code) {
            case error.PERMISSION_DENIED:
              setFeedBack("User denied the request for Geolocation.")
              break;
            case error.POSITION_UNAVAILABLE:
                setFeedBack("Location information is unavailable.")
              break;
            case error.TIMEOUT:
                setFeedBack("The request to get user location timed out.")
              break;
            case error.UNKNOWN_ERROR:
                setFeedBack("An unknown error occurred.")
              break;
            default:
                console.log('failed somewhere in navigator')
                break;
        }
        setAllowed(false);
    }
    //get the current positon when the component mounts
    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, fail)
        }
        else{
            setAllowed(false);
            setFeedBack('Geolocation is not supported by this browser')
    
        }
    }, [])
    return [userLocation, feedBack, allowed];
}


export function useReverseGeocoding(coords){
    const [address, setAddress] = useState('')
    useEffect(()=>{
        console.log('coords: ' + coords);
        if(address === ''){
            $.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=AIzaSyC53vjJz1yGfttbXxeHvFgf_hzN-KnwgWQ`, (results)=>{
                console.log(results);
                setAddress(results);
        
            })
        }
    })

    return address;
}

/**
 * sets a start point and returns the start point along with a function that calculates the distance in KM to another point specified in the parameter
 * @param {*} start - inital start point to measure distance from
 */
export function useMapCoordinateDistance(start){
    const [startPoint, setStartPoint] = useState(start)
    /**
     * calculates distance between 2 lat/lng literals
     * @param {*} position - object with shape {lat:number, lng:number}. Used to compute distance 
     */
    function measureCoordinateDistance(position){  // generally used geo measurement function
        var earthCircumfrence = 40075
        //length of 1 degree of latitude
        var latitudeLength = earthCircumfrence/360;
        //1 degree of longitude. (dependent on latitude)
        var longitudeLength = earthCircumfrence * (Math.cos(position.lat)/360)
        //get differnece in longitude an latitude
        var degreeDiffLat = startPoint.lat - position.lat;
        var degreeDiffLng = startPoint.lng - position.lng;
        //multiply differences by the latitude and longitude lengths then use pythagorean theorem to get the distance between points
        var distanceSquared = Math.pow(degreeDiffLat * latitudeLength, 2) + Math.pow(degreeDiffLng * longitudeLength, 2);
        var distance = Math.sqrt(distanceSquared);
        return distance
    }
    //if start changes then set the start point state
    useEffect(()=>{
        setStartPoint(start);
        console.log('set start point')
    },[start])
    return [startPoint, setStartPoint, measureCoordinateDistance]
}

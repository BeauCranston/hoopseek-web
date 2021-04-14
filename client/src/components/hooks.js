
import { useEffect, useState } from 'react';
import $ from 'jquery';
/**
 * Takes an object or array of objects, and convert's the keys into an array of Title Heading Formatted Strings. The heading array maintains the same order of the object shape
 * @param {* object or array of objects passed in} object 
 */
export function useObjectKeysAsHeadings(object){
    var headers = []
    console.log(object)
    // determien if the object value is undefined or empty
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

export function useNavigator(){
    const [userLocation, setUserLocation] = useState(null);
    const [feedBack, setFeedBack] = useState('');
    const [allowed, setAllowed] = useState(null);
    function success(position){
        setUserLocation({lat: position.coords.latitude, lng: position.coords.longitude});
        setFeedBack('Successfully got user\'s location');
        setAllowed(true);
    }
    function fail(error){
        setAllowed(false);
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
    }
    console.log(navigator.geolocation)
    useEffect(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, fail)
        }
        else{
            setAllowed(false);
            setFeedBack('Geolocation is not supported by this browser')
    
        }
    }, [userLocation])
    

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

// export function useGoogleReverseGeocoding(coords){
//     var geocoder = new google.maps.Geocoder;
//     const [reverseGeocodingResults, setReverseGeocodingResults] = useState(null);
//     geocoder.geocode({'location':coords}, (results, status)=>{
//         if(status === 'OK'){
//             setReverseGeocodingResults(results)
//         }
//         console.log(results);
//     })
//     return reverseGeocodingResults;
    
// }
import React, { useEffect, useRef, useState } from "react";
import search_icon from "../assets/search.jpg";
import clear from "../assets/clear.jpg";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.webp";
import snow from "../assets/snow.png";
import rain from "../assets/Rain.png";
import wind from "../assets/wind.jpg";
import mist from "../assets/mist.png"
import thunder from "../assets/thunder.png"
import humidity from "../assets/humidity.png";

const Weather = () => {
    const[weatherData,setWeatherData]=useState(null)
   const[locationError,setLocationError]=useState(null)
    const inputRef=useRef()
   
    const allIcons={
        "01d":clear,
        "01n":clear,
        "02d":cloud,
        "02n":cloud,
        "03d":cloud,
        "03n":cloud,
        "04d":drizzle,
        "04n":drizzle,
        "09d":rain,
        "09n":rain,
        "10d":rain,
        "10n":rain,
        "11d":thunder,
        "11n":thunder,
        "13d":snow,
        "13n":snow,
        "50n":mist,
        "50d":mist
    }
  const search = async (city) => {
    if(city==""){
        alert("Enter City Name")
        return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
        }`;
        const response= await fetch(url)
        const data= await response.json()
        console.log(data);
        const icon=allIcons[data.weather[0].icon]
        setWeatherData({
            humidity:data.main.humidity,
            wind:data.wind.speed,
            temperature:Math.floor(data.main.temp),
            location:data.name,
            icon:icon
        })
    } catch (error) {
        console.log("error");
        setWeatherData(null)
        
    }
   
  };

  const fetchByLocation=async(latitude,longitude)=>{
    try {
        const url=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_APP_ID}
        `
        const response=await fetch(url)
        const data=await response.json()
        console.log(data);
        const icon=allIcons[data.weather[0].icon];
        setWeatherData({
            humidity:data.main.humidity,
            wind:data.wind.speed,
            temperature:Math.floor(data.main.temp),
            location:data.name,
            icon:icon
        })
    } catch (error) {
        console.log("error in fetching weather data");
        setWeatherData(null)
    }
  }
  const handleLocationSearch=()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position) => {
               fetchByLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationError("Unable to retrieve location. Please enable location services.");
            }
        );
    } else {
        setLocationError("Geolocation is not supported by this browser.");
    }

    }
  

  

  useEffect(()=>{
    search("Gorakhpur")
},[])
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e2d4ff] p-4">
      <div className="flex flex-col items-center bg-cyan-950 rounded shadow-md p-8">
        <div className="flex items-center mb-4">
          <input ref={inputRef}
            type="text"
            placeholder="search"
            
            className="flex-grow h-10 text-base px-3 border rounded-l"
          />
          <img
            src={search_icon}
            alt="search icon"
            onClick={()=>search(inputRef.current.value)}
           
            className="h-10 w-10 cursor-pointer"
          />
        </div>  
        <button 
                    onClick={handleLocationSearch}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Use Current Location
                </button>

                {locationError && <p className="text-red-500 mb-4">{locationError}</p>}

        {weatherData?<>
            <img src={weatherData.icon} alt="clear" className="h-20 w-20 mb-4" />


<p className="font-bold text-white text-2xl mb-1">{weatherData.temperature}°c</p>
<p className="font-bold text-white text-2xl">{weatherData.location}</p>

<div className="flex gap-8 mt-4">
  <div className="flex flex-col items-center">
    <img src={humidity} alt="humidity" className="h-7 w-7 mb-2" />
    <div>
      <p className="text-white text-xs">{weatherData.humidity}%</p>
      <span className="text-white text-xs">Humidity</span>
    </div>
  </div>

  <div className="flex flex-col items-center">
    <img src={wind} alt="wind" className="h-7 w-7 mb-2" />
    <div>
      <p className="text-white text-xs">{weatherData.wind} km/hr</p>
      <span className="text-white text-xs">Wind Speed</span>
    </div>
  </div>
</div>
        </>:<></>}

       
      </div>
    </div>
  );
};

export default Weather;

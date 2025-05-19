import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const [countryData, setCountryData] = useState([])
  const [search, setSearch] = useState("")
  const [matchingCountries, setMatchingCountries] = useState([])
  const [outputField, setOutputField] = useState("Specify a filter")
  // const [capitalCoordinates, setCapitalCoordinates] = useState([0, 0])
  const url = "https://studies.cs.helsinki.fi/restcountries/api/all"
  let countryNames = []

  useEffect(() => {
      axios
        .get(url)
        .then(response => {
          setCountryData(response.data)
        })
  }, [])

  const fetchCountryNames = () => {
    if (countryData.length > 0) {
      countryNames = countryData.map(country => country.name.common)
    }
  }

  fetchCountryNames()

  const findMatchingCountries = (event) => {
    const matches = countryNames.filter(name => name.toLowerCase().includes(event.target.value.toLowerCase()))
    if (matches.length > 10) {
      setOutputField("Too many matches, specify another filter")
      return
    }

    else if (matches.length > 1) {
      setOutputField(matches.map((name, i) => <CountryListObject key={i} name={name} />))
    }

    else if (matches.length === 1) {
      const countryIndex = countryNames.indexOf(matches[0])
      const countryObject = countryData[countryIndex]
      const result = <CountryInfo name={matches[0]} capital={countryObject.capital}
                                  area={countryObject.area} languages={countryObject.languages}
                                  image={countryObject.flags.png} />
      setOutputField(result)
    }

    else {
      setOutputField("No matches")
    }
  }

  const CountryListObject = (props) => {
    const countryIndex = countryNames.indexOf(props.name)
    const countryObject = countryData[countryIndex]
    const result = <CountryInfo name={props.name} capital={countryObject.capital}
                                area={countryObject.area} languages={countryObject.languages}
                                image={countryObject.flags.png} />
    return (
      <div>
        {props.name} <button onClick={() => setOutputField(result)}>Show</button>
      </div>
    )
  }

  const CountryInfo = (props) => {
    // findCoordinates(props.capital)
    return (
      <div>
        <h1>{props.name}</h1>
        <div>Capital: {props.capital}</div>
        <div>Area: {props. area}</div>
        <h2>Languages</h2>
        <LanguageList languages={props.languages}/>
        <img src={props.image}></img>
        <WeatherInfo capital={props.capital} />
      </div>
    )
  }

  const WeatherInfo = (props) => {
    const [weather, setWeather] = useState(null);
    const [imageLink, setImageLink] = useState("")
    const apiKey = "055f136004cf28852dd3e29ee43ea950"
    // const apiKey = import.meta.env.VITE_SOME_KEY

    useEffect(() => {
      const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${props.capital}&limit=1&appid=${apiKey}`;
      axios
        .get(geocodeUrl)
        .then(response => {
          if (response.data && response.data.length > 0) {
            const coordinates = [response.data[0].lat, response.data[0].lon];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${apiKey}`;
            axios
              .get(weatherUrl)
              .then(response => {
                setWeather(response.data);
                setImageLink(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
              });
          }
        });
    }, [props.capital]);

    if (!weather) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h2>Weather in {props.capital}</h2>
        <div>
          Temperature: {KelvinToCelsius(weather.main.temp)} Celcius
        </div>
        <img src={imageLink}></img>
      </div>
    );
  }

  const KelvinToCelsius = (kelvin) => {
    const celcius = parseFloat(kelvin) - 273.15;
    return Number(celcius.toFixed(1))
  }

  const LanguageList = (props) => {
    return (
      <ul>
      {props.languages && Object.values(props.languages).map((lang, i) => (
        <li key={i}>{lang}</li>
      ))}
      <br></br>
      </ul>
    )
  }

  return (
    <div>
      <div>
        Find countries <input type="text" onChange={findMatchingCountries} ></input>
      </div>
      <div>{outputField}</div>
    </div>
  )
}

export default App

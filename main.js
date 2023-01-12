const apiKey = "2cc257da10fc85084b827a8a7a9550b8";
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      console.log(data);
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        <button class="forecast-btn" onclick="setForecast('${name}')">Forecast</button>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

function setForecast(cityName) {
  const city = cityName.toLowerCase();
  const url_forcast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url_forcast)
    .then(response => response.json())
    .then(data => {
        const { main, name, sys, weather } = data;
        console.log(data);
        const forecastList = data.list;

        const holder = document.querySelector(".forecast-sec .container-forecast");
          holder.innerHTML = "";

        for (let index = 0; index < forecastList.length; index++) {
              const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
              forecastList[index].weather[0]["icon"]
            }.svg`;        
            const timestamp = new Date(forecastList[index].dt * 1000).toUTCString();
            // console.log(forecastList[index]);
            const markup_Forecast = `
            <div class="forecast-data">
                <span class="date">${timestamp}</span>
                <span class="icon"><img class="forecast-icon" src="${icon}"></span>
                <span class="temp">${Math.round(forecastList[index].main.temp)}
                <sup>°C</sup></span>
              </div>
              `;
              holder.innerHTML += markup_Forecast;
      }


    });

}

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

weatherForm.addEventListener("submit", e => {
  e.preventDefault(); //Prevent the page to refresh

  const location = search.value;

  messageOne.textContent = "Loading...";
  messageTwo.textContent = " ";

  //console.log(location);

  console.log("Fatched weather information");
  fetch("/weather?address=" + location).then(response => {
    response.json().then(data => {
      if (data.error) {
        messageOne.textContent = data.error;
        //console.log(data.error);
      } else {
        messageOne.textContent = data.location;

        messageTwo.textContent =
          data.forecast.summary +
          " It is currently " +
          data.forecast.temperature +
          " degrees out. There is a " +
          data.forecast.preciptation * 100 +
          " % of chance of rain";
        //console.log(data.location);
        console.log(data.forecast);
      }
    });
  });
});

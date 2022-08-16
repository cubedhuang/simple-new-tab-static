// ----- Focus/Unfocus -----

addEventListener("blur", () => {
	document.body.classList.add("unfocused");
});

addEventListener("focus", () => {
	document.body.classList.remove("unfocused");
});

// ----- Links -----

const links = document.getElementById("links");

links.innerHTML = Object.entries(Config.Links)
	.map(
		([name, links]) => `
		<div>
			<h2>${name}</h2>
			<ul>
				${links
					.map(
						({ name, url }) =>
							`<li><a href="${url}">${name}</a></li>`
					)
					.join("")}
			</ul>
		</div>`
	)
	.join("");

// ----- Quote -----

const quote = document.getElementById("quote");
const quoteAuthor = document.getElementById("quote-author");

fetch(`https://api.quotable.io/random?tags=${Config.QuoteTags.join("|")}`)
	.then(res => res.json())
	.then(data => {
		quote.textContent = `"${data.content}"`;
		quoteAuthor.textContent = data.author;
	});

// ----- Clock -----

const clock = document.getElementById("clock");

const df = new Intl.DateTimeFormat("en", {
	month: "long",
	day: "numeric",
	year: "numeric",
	weekday: "long"
});
const tf = new Intl.DateTimeFormat("en", {
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
});

function setClock() {
	const date = new Date();
	clock.textContent = `${df.format(date)}\n${tf.format(date)}`;
}

setInterval(() => setClock(), 1000);
setClock();

// ----- Weather -----

const weather = document.getElementById("weather");

function setWeather(data) {
	console.log(data);

	weather.innerHTML = `
	<div>
		<h2>Weather</h2>
		<p>in ${data.name}</p>
		<p>${data.weather[0].description}</p>
	</div>
	<div>
		<h2>Temperature</h2>
		<p>temp ${data.main.temp.toFixed(2)}°F</p>
		<p>min ${data.main.temp_min.toFixed(2)}°F</p>
		<p>max ${data.main.temp_max.toFixed(2)}°F</p>
		<p>feels like ${data.main.feels_like.toFixed(2)}°F</p>
	</div>
	<div>
		<h2>Condition</h2>
		<p>humidity ${data.main.humidity}%</p>
		<p>clouds ${data.clouds.all}%</p>
		<p>wind ${data.wind.speed.toFixed(2)} mph</p>
	</div>
	`;
}

// Only request weather data every 10 minutes with localStorage

const weatherData = localStorage.getItem("weatherData");
const weatherDataTime = localStorage.getItem("weatherDataTime");

if (!weatherData || Date.now() - weatherDataTime > 600_000) {
	const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${Config.WeatherKey}`;

	navigator.geolocation.getCurrentPosition(position => {
		const lat = position.coords.latitude;
		const long = position.coords.longitude;

		fetch(`${weatherAPI}&lat=${lat}&lon=${long}`)
			.then(res => res.json())
			.then(data => {
				setWeather(data);

				localStorage.setItem("weatherData", JSON.stringify(data));
				localStorage.setItem("weatherDataTime", Date.now());
			});
	});
} else {
	setWeather(JSON.parse(weatherData));
}

// ----- Presence -----

const discord = document.getElementById("discord");

lanyard({
	userId: Config.DiscordUser
}).then(presence => {
	discord.innerHTML =
		`<div>
			<h2>Discord</h2>
			<p>${presence.discord_user.username}#${presence.discord_user.discriminator}</p>
		</div>` +
		presence.activities
			.map(({ name, state, details }) => {
				return `<div>
					<h3>${name}</h3>
					<p>${state || ""}</p>
					<p>${details || ""}</p>
				</div>`;
			})
			.join("");
});

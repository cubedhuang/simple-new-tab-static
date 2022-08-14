// ----- Quote -----

const quote = document.getElementById("quote");
const quoteAuthor = document.getElementById("quote-author");

fetch("https://api.quotable.io/random?tags=future|technology|science")
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
	clock.innerText = `${df.format(date)}\n${tf.format(date)}`;
}

setInterval(() => setClock(), 1000);
setClock();

// ----- Presence -----

const ul = document.getElementById("presence");

lanyard({
	userId: "299707523370319883",
	socket: true,
	onPresenceUpdate(presence) {
		ul.innerHTML = presence.activities
			.map(({ name, state, details }) => {
				return `<div>
					<h2 class="text-white">${name}</h2>
					${state ? `${state}` : ""}
					${details ? `<br>${details}` : ""}
				</div>`;
			})
			.join("");
	}
});

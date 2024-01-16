require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./services/db");
const axios = require("axios");
const Genres = require("./models/genre");
const Events = require("./models/event");

const size = 200;

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const saveNewEvent = async (event, genre) => {
  const newEvent = new Events({
    eventId: event?.id,
    name: event?.name,
    genre: genre,
    media: event?.images.map((image) => ({ url: image.url })),
    // ...(event?.promoter && { promoter: event.promoter.name }),
    // ...(event?.promoters && {
    //   promoters: event.promoters.map((promoter) => ({
    //     name: promoter.name,
    //   })),
    // }),
    dates: {
      start: {
        ...(event?.dates?.start?.localDate && {
          localDate: event.dates.start.localDate,
        }),
        ...(event?.dates?.start?.localTime && {
          localTime: event.dates.start.localTime,
        }),
        ...(event?.dates?.start?.dateTime && {
          dateTime: event.dates.start.dateTime,
        }),
      },
      end: {
        ...(event?.dates?.end?.localDate && {
          localDate: event.dates.end.localDate,
        }),
        ...(event?.dates?.end?.localTime && {
          localTime: event.dates.end.localTime,
        }),
        ...(event?.dates?.end?.dateTime && {
          dateTime: event.dates.end.dateTime,
        }),
      },
    },
    ...(event?._embedded?.venues[0] && {
      location: {
        ...(event?._embedded?.venues[0]?.location?.longitude && {
          longitude: event?._embedded?.venues[0]?.location?.longitude,
        }),
        ...(event?._embedded?.venues[0]?.location?.latitude && {
          latitude: event?._embedded?.venues[0]?.location?.latitude,
        }),
      },
    }),
    address: `${
      event?._embedded?.venues[0]?.name &&
      event?._embedded?.venues[0]?.name.trim()
    }${
      event?._embedded?.venues[0]?.address?.line1 &&
      ", " + event._embedded.venues[0].address.line1.trim()
    }${
      event?._embedded?.venues[0]?.city?.name &&
      ", " + event._embedded.venues[0].city.name.trim()
    }${
      event?._embedded?.venues[0]?.state?.name &&
      ", " + event._embedded.venues[0].state.name.trim()
    }${
      event?._embedded?.venues[0]?.country?.name &&
      ", " + event._embedded.venues[0].country.name.trim()
    }`,
    description: event?.info,
    ...(event?.pleaseNote && { pleaseNote: event.pleaseNote }),
    locale: event?.locale,
    sales: {
      public: {
        startDate: event.sales.public.startDateTime,
        endDate: event.sales.public.endDateTime,
      },
      ...(event?.sales?.presales && {
        presales: event.sales.presales.map((presale) => ({
          name: presale.name,
          url: presale.url,
          startDate: presale.startDateTime,
          endDate: presale.endDateTime,
        })),
      }),
    },
    ...(event?.priceRanges && {
      priceRanges: event.priceRanges.map((priceRange) => ({
        currency: priceRange.currency,
        min: priceRange.min,
        max: priceRange.max,
      })),
    }),
    ...(event?.ticketLimit && {
      ticketLimit: event.ticketLimit.info,
    }),
    ...(event?.accessibility && {
      accessibilty: event.accessibility.info,
    }),
    url: event?.url,
    expirationDate: event?.dates?.start?.dateTime,
  });

  newEvent
    .save()
    .then(() => {
      console.log("L'événement a bien été ajouté.");
    })
    .catch(() => console.error("L'énévement n'a pas pu être ajouté."));
};

const addNewEvents = (events) => {
  for (const event of events) {
    const classifications = event?.classifications;

    if (classifications.length > 0) {
      const genreName = classifications[0].genre.name;
      const genre = new Genres({
        name: genreName,
        color: generateRandomColor(),
      });

      genre
        .save()
        .then((newGenre) => {
          console.log("Le genre a bien été ajouté");
          saveNewEvent(event, newGenre);
        })
        .catch(() => {
          console.error("Le genre n'a pas pu être ajouté.");
          Genres.findOne({ name: genreName })
            .then((eventGenre) => {
              saveNewEvent(event, eventGenre);
            })
            .catch(() => {
              console.error("Le genre n'a pas pu être récupéré.");
            });
        });
    }
  }
};

db.on("error", (err) => {
  console.error("Erreur de connexion à la base de données :", err);
});
db.once("open", () => {
  console.log("Connexion à la base de données établie");

  axios
    .get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&countryCode=FR&locale=fr&size=${size}&classificationName=chanson+fran%C3%A7aise,pop,rock,hip-hop/rap,r&b,k-pop+coréen,ragga,trap,drill'n'bass,jazz,soul,rap+français`
    )
    .then((response) => {
      addNewEvents(response.data._embedded.events);
      setTimeout(() => {
        mongoose.disconnect();
      }, 120000);
    })
    .catch(() => {
      console.error("Impossible de récupérer les événéments.");
    });
});

// Gérer l'ajout journalier d'événements --> service de cloud computing comme AWS Lambda, Google Cloud Functions, Azure Functions

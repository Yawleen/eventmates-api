const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./genre");

const eventSchema = new Schema({
  eventId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  genre: {
    type: Schema.Types.ObjectId,
    ref: "Genres",
  },
  media: {
    url: {
      type: String,
    },
  },
  dates: {
    start: {
      localDate: {
        type: String,
      },
      localTime: {
        type: String,
      },
      dateTime: {
        type: Date,
      },
    },
    end: {
      localDate: {
        type: String,
      },
      localTime: {
        type: String,
      },
      dateTime: {
        type: Date,
      },
    },
  },
  address: {
    type: String,
  },
  location: {
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  description: {
    type: String,
  },
  pleaseNote: {
    type: String,
  },
  locale: {
    type: String,
  },
  sales: {
    public: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    presales: [
      {
        name: { type: String },
        url: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
  },
  priceRanges: [
    {
      currency: { type: String },
      min: { type: Number },
      max: { type: Number },
    },
  ],
  ticketLimit: {
    type: String,
  },
  accessibility: {
    type: String,
  },
  url: {
    type: String,
  },
  createdGroupsTotal: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => value >= 0,
    },
  },
});

module.exports = mongoose.model("Events", eventSchema);

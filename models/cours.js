const mongoose = require("mongoose");
const coursSchema = mongoose.Schema(
  {
    types: [
      {
        name: {
          type: String,
          required: [true, "type is required"],
          enum: {
            values: ["CM", "TD", "TP"],
            message: "{VALUE} is not supported",
          },
        },
        nbh: {
          type: Number,
          required: true,
          default: 1.5,
        },
      },
    ],
    // tauxHoreure: {
    //   type: Number,
    //   required: true,
    // },
    // sommeUM: {
    //   type: Number,
    //   required: true,
    // },
    date: {
      type: Date,
      default: Date.now(),
      required: [true, "date is required"],
    },
    debit: {
      type: Number,
      required: [true, "debit d'heures is required"],
      default: 9,
    },

    professeur: {
      type: mongoose.Schema.ObjectId,
      ref: "Professeur",
      required: [true, "professeur is required"],
    },
    matiere: {
      type: mongoose.Schema.ObjectId,
      ref: "Matiere",
      required: [true, "matiere is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    isSigne: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* coursSchema.index({ date: 1, debit: 1, matiere: 1 }, { unique: true });
coursSchema.index({ date: 1, debit: 1, professeur: 1 }, { unique: true }); */

module.exports = mongoose.model("Cours", coursSchema);

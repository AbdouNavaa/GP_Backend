class CoursReponse {
  constructor(
    _id,
    matiere,
    professeur,
    id,
    email,
    types,
    TH,
    date,
    debit,
    CM,
    TD,
    TP,
    somme,
    prix,
    isSigne,
    isPaid
  ) {
    this._id = _id;
    this.matiere = matiere;
    this.professeur = professeur;
    this.id = id;
    this.email = email;
    this.types = types;
    this.TH = TH;
    this.date = date;
    this.debit = debit;
    this.CM = CM;
    this.TD = TD;
    this.TP = TP;
    this.somme = somme;
    this.prix = prix;
    this.isSigne = isSigne;
    this.isPaid = isPaid;
  }
}
module.exports = CoursReponse;
/* const data1 = {
  status: "success",
  cours: [
    {
      _id: "64a8a0c80d9d3268d41389b2",
      type: "TD",
      date: "2023-07-06T22:00:00.000Z",
      heures: 2,
      professeur: {
        _id: "64a735d727ee983ac6079380",
        nom: "ahmed",
        prenom: "yahya",
        mobile: 41674030,
        email: "ahmed@gmail.com",
        matieres: [
          "64a5db956d38809388ffcd9f",
          "64a66abc6ea38e7b308693b8",
          "64a6a450e95c91fbb32fe10c",
          "64a6abffe95c91fbb32fe168",
        ],
        __v: 0,
        id: "64a735d727ee983ac6079380",
      },
      matiere: {
        _id: "64a5db956d38809388ffcd9f",
        name: "french",
        prix: 100,
        description: "french is a second languages of words",
        categorie: "64a5f022773b4bfd0f342bb9",
        __v: 0,
        id: "64a5db956d38809388ffcd9f",
      },
      isSigne: false,
      isPaid: false,
      updatedAt: "2023-07-09T08:18:06.559Z",
    },
    {
      _id: "64a8a25a0d9d3268d41389f3",
      type: "TD",
      date: "2023-07-05T22:00:00.000Z",
      heures: 2,
      professeur: {
        _id: "64a7bd7a6161742c900455be",
        nom: "mohamed",
        prenom: "ahmed",
        mobile: 41674066,
        email: "mohamed@gmail.com",
        matieres: [
          "64a6abffe95c91fbb32fe168",
          "64a6a450e95c91fbb32fe10c",
          "64a66abc6ea38e7b308693b8",
        ],
        __v: 0,
        id: "64a7bd7a6161742c900455be",
      },
      matiere: {
        _id: "64a6abffe95c91fbb32fe168",
        name: "note js",
        prix: 100,
        description: "semple programming languages !",
        categorie: "64a5f90a773b4bfd0f342c36",
        __v: 0,
        id: "64a6abffe95c91fbb32fe168",
      },
      isSigne: false,
      isPaid: false,
      updatedAt: "2023-07-08T07:50:43.662Z",
    },
    {
      isSigne: false,
      isPaid: false,
      _id: "64a8159f47951e548dc68d81",
      type: "CM",
      date: "2023-07-04T22:00:00.000Z",
      heures: 1.5,
      professeur: {
        _id: "64a735d727ee983ac6079380",
        nom: "ahmed",
        prenom: "yahya",
        mobile: 41674030,
        email: "ahmed@gmail.com",
        matieres: [
          "64a5db956d38809388ffcd9f",
          "64a66abc6ea38e7b308693b8",
          "64a6a450e95c91fbb32fe10c",
          "64a6abffe95c91fbb32fe168",
        ],
        __v: 0,
        id: "64a735d727ee983ac6079380",
      },
      matiere: {
        _id: "64a66abc6ea38e7b308693b8",
        name: "anglais",
        prix: 100,
        description: "English is a best languges of the world",
        categorie: "64a5f022773b4bfd0f342bb9",
        __v: 0,
        id: "64a66abc6ea38e7b308693b8",
      },
      updatedAt: "2023-07-08T20:04:43.817Z",
    },
  ],
};

var jsonStringify = function (obj) {
  for (key in obj) {
    const value = obj[key];
    const type = typeof value;

    //console.log(obj[key].type);
    if (typeof (obj[key] == "object")) {
      Object.assign(data1, jsonStringify(value));
    } else {
      if (
        ["string", "boolean"].includes(type) ||
        (type === "number" && !isNaN(value))
      ) {
        data1[key] = value;
        console.log(key + ":" + obj[key]);
      }
    }
  }
  console.log(data);
  return data1;
};

jsonStringify(data1);

module.exports = jsonStringify;
 */

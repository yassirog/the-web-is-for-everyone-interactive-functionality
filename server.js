// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import { name } from "ejs";
import fetchJson from "./helpers/fetch-json.js";

// Maak een nieuwe express app aan
const app = express();

// Importeer het npm pakket express uit de node_modules map
import express, { json } from "express";

// Stel ejs in als template engine
app.set("view engine", "ejs");

// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static("public"));

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// TODO: routes voor deze Hand-Footprint applicatie..

// Variabeles aanmaken voor de routes
const apiUrl = "https://fdnd-agency.directus.app/items/";
const sdgList = apiUrl + "hf_sdgs";
const companyList = apiUrl + "hf_companies";
const stakeholders = apiUrl + "hf_stakeholders"

app.get("/", function (request, response) {
  fetchJson(sdgList).then((sdgsUitDeAPI) => {
    fetchJson(companyList).then((companiesUitDeAPI) => {
      response.render("index", { sdgs: sdgsUitDeAPI.data, companies: companiesUitDeAPI.data });
    });
  });
});

app.get("/sdg/:sdg", function (request, response) {
  fetchJson(sdgList + '?filter={"id":' + request.params.sdg + "}").then(
    (sdgDetail) => {
      response.render("sdg", { sdg: sdgDetail.data[0] });
    }
  );
});

app.get("/inlogpagina", function (request, response) {
  fetchJson(companyList).then((companiesUitDeAPI) => {
    response.render("inlogpagina", { companies: companiesUitDeAPI.data });
  });
});

app.post("/", async function (request, response) {
  try {
	const bedrijfId = request.body.companies;
  console.log(bedrijfId);
  response.redirect('/bedrijf/' + bedrijfId);

  } catch (error) {
    console.error("Error handling POST request:", error);
    response.status(500).send("Error handling POST request");
  }
});

app.get("/bedrijf/:id", function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(companyList + '/' + request.params.id).then(
	(companyData) => {

    fetchJson(stakeholders + '/' + request.params.id).then(
      (stakeholderData) => {
      response.render("bedrijf", {company: companyData.data, stakers: stakeholderData.data });

    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd bedrijf
    });
  })
});

app.post("/bedrijf/:id", async function (request, response) {
  try {
  console.log(bedrijfId);
  response.redirect('/bedrijf/' + bedrijfId);

  } catch (error) {
    console.error("Error handling POST request:", error);
    response.status(500).send("Error handling POST request");
  }
});

app.get("/addStakeholder/:id", function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(companyList + '/' + request.params.id).then(
	(companyData) => {

    fetchJson(stakeholders + '/' + request.params.id).then(
      (stakeholderData) => {
      response.render("addStakeholder", {company: companyData.data, stakers: stakeholderData.data });

    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd bedrijf
    });
  })
});

app.post("/addStakeholder/:id", async function (request, response) {
  try {

    const bedrijfId = request.params.id;
    const medewerkers = request.body.medewerkers;
    const financiers = request.body.financiers;
    const leveranciers = request.body.leveranciers;
    const klanten = request.body.klanten;
    const omgeving = request.body.omgeving;
    const name = request.body.message;
    const stakeholder = [];

    let aangevinkteRadiobox;
    if (medewerkers) {
        aangevinkteRadiobox = "medewerkers";
    } else if (financiers) {
        aangevinkteRadiobox = "financiers";
    } else if (leveranciers) {
        aangevinkteRadiobox = "leveranciers";
    } else if (klanten) {
        aangevinkteRadiobox = "klanten";
    } else if (omgeving) {
        aangevinkteRadiobox = "omgeving";
    }
    
    console.log('Bedrijf: ' + bedrijfId);
    console.log('Type: ' + aangevinkteRadiobox);
    console.log('Naam: ' + name)


    stakeholder.push(bedrijfId, aangevinkteRadiobox, name);

    console.log(stakeholder);
  } catch (error) {
    console.error("Error handling POST request:", error);
    response.status(500).send("Error handling POST request");
  }
});

// // Als we vanuit de browser een POST doen op de detailpagina van een persoon
// // Als we vanuit de browser een POST doen op de detailpagina van een persoon
// app.post("/bedrijf/:id", async function (request, response) {
//   try {
// 	const bedrijfId = request.body.bedrijf;
//   console.log(bedrijfId);



//   } catch (error) {
//     console.error("Error handling POST request:", error);
//     response.status(500).send("Error handling POST request");
//   }
// });

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

const WHATSAPP_NUMBER = "355000000000";
const EMAIL_ADDRESS = "info@dentalba.al";

function whatsappUrl(message) {
  if (WHATSAPP_NUMBER === "355000000000") {
    const inArticle = window.location.pathname.includes("/articles/");
    const contactPath = inArticle ? "../contact.html" : "contact.html";
    return `${contactPath}?message=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function wireWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = link.getAttribute("data-message") || "Hello DentAlba, I would like a free dental treatment plan before I travel.";
    link.href = whatsappUrl(message);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function wireQuoteForms() {
  document.querySelectorAll("[data-quote-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [
        "Hello DentAlba, I would like a free dental treatment plan.",
        `Name: ${data.get("name") || ""}`,
        `Country: ${data.get("country") || ""}`,
        `Language: ${data.get("language") || ""}`,
        `Treatment: ${data.get("treatment") || ""}`,
        `Travel month: ${data.get("month") || ""}`,
        `Notes: ${data.get("notes") || ""}`,
        "I can send X-rays or photos here."
      ];
      if (event.submitter?.hasAttribute("data-email-submit")) {
        const subject = encodeURIComponent("DentAlba treatment plan request");
        const body = encodeURIComponent(lines.join("\n"));
        window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
        return;
      }

      window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
    });
  });
}

const calculatorCopy = {
  en: {
    savings: "Estimated saving",
    local: "At home",
    dentAlba: "DentAlba + flight",
    flight: "Flight after reimbursement",
    prefix: "You could save about",
    disclaimer: "Estimate only. Final treatment depends on X-rays, scans, diagnosis, travel dates, and confirmed package terms."
  },
  fr: {
    savings: "Economie estimee",
    local: "Chez vous",
    dentAlba: "DentAlba + vol",
    flight: "Vol apres remboursement",
    prefix: "Vous pourriez economiser environ",
    disclaimer: "Estimation uniquement. Le traitement final depend des radios, scans, diagnostic, dates de voyage et conditions du forfait confirme."
  }
};

const countryCosts = {
  france: { label: "France", all4: 14000, all6: 17000 },
  belgium: { label: "Belgium", all4: 15000, all6: 18000 },
  uk: { label: "United Kingdom", all4: 18000, all6: 22000 },
  italy: { label: "Italy", all4: 12000, all6: 15000 },
  spain: { label: "Spain", all4: 11000, all6: 14000 },
  netherlands: { label: "Netherlands", all4: 16000, all6: 19500 },
  luxembourg: { label: "Luxembourg", all4: 17000, all6: 20500 },
  switzerland: { label: "Switzerland", all4: 24000, all6: 29000 },
  germany: { label: "Germany", all4: 15500, all6: 19000 },
  austria: { label: "Austria", all4: 15000, all6: 18500 },
  norway: { label: "Norway", all4: 22000, all6: 26500 },
  denmark: { label: "Denmark", all4: 20000, all6: 24000 },
  sweden: { label: "Sweden", all4: 19000, all6: 23000 },
  finland: { label: "Finland", all4: 18000, all6: 22000 },
  ireland: { label: "Ireland", all4: 16000, all6: 19500 },
  portugal: { label: "Portugal", all4: 10500, all6: 13500 },
  greece: { label: "Greece", all4: 10000, all6: 13000 },
  cyprus: { label: "Cyprus", all4: 11000, all6: 14000 },
  malta: { label: "Malta", all4: 12000, all6: 15000 },
  croatia: { label: "Croatia", all4: 9000, all6: 12000 },
  slovenia: { label: "Slovenia", all4: 10000, all6: 13000 },
  slovakia: { label: "Slovakia", all4: 8500, all6: 11500 },
  czechia: { label: "Czechia", all4: 9000, all6: 12000 },
  poland: { label: "Poland", all4: 8500, all6: 11500 },
  hungary: { label: "Hungary", all4: 8000, all6: 11000 },
  romania: { label: "Romania", all4: 7500, all6: 10500 },
  bulgaria: { label: "Bulgaria", all4: 7000, all6: 10000 },
  estonia: { label: "Estonia", all4: 10000, all6: 13000 },
  latvia: { label: "Latvia", all4: 9000, all6: 12000 },
  lithuania: { label: "Lithuania", all4: 9000, all6: 12000 },
  usa: { label: "USA", all4: 26000, all6: 32000 },
  canada: { label: "Canada", all4: 23000, all6: 28500 }
};

const dentalbaCosts = {
  all4: 4860,
  all6: 6060
};

function formatEuro(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Math.max(0, Math.round(value)));
}

function wireSavingsCalculator() {
  document.querySelectorAll("[data-calculator]").forEach((calculator) => {
    const lang = calculator.getAttribute("data-lang") || "en";
    const copy = calculatorCopy[lang] || calculatorCopy.en;
    const country = calculator.querySelector("[data-calc-country]");
    const treatment = calculator.querySelector("[data-calc-treatment]");
    const flight = calculator.querySelector("[data-calc-flight]");
    const local = calculator.querySelector("[data-calc-local]");
    const total = calculator.querySelector("[data-calc-total]");
    const reimbursement = calculator.querySelector("[data-calc-reimbursement]");
    const savings = calculator.querySelector("[data-calc-savings]");
    const percent = calculator.querySelector("[data-calc-percent]");
    const note = calculator.querySelector("[data-calc-note]");

    function calculate() {
      const selectedCountry = countryCosts[country.value] || countryCosts.france;
      const treatmentKey = treatment.value;
      const localCost = selectedCountry[treatmentKey];
      const dentAlbaCost = dentalbaCosts[treatmentKey];
      const flightCost = Number(flight.value || 0);
      const flightAfterReimbursement = Math.max(0, flightCost - 200);
      const totalCost = dentAlbaCost + flightAfterReimbursement;
      const saved = Math.max(0, localCost - totalCost);
      const pct = localCost > 0 ? Math.round((saved / localCost) * 100) : 0;

      local.textContent = formatEuro(localCost);
      total.textContent = formatEuro(totalCost);
      reimbursement.textContent = formatEuro(flightAfterReimbursement);
      savings.textContent = formatEuro(saved);
      percent.textContent = `${pct}%`;
      note.textContent = `${copy.prefix} ${formatEuro(saved)}. ${copy.disclaimer}`;
    }

    [country, treatment, flight].forEach((input) => input.addEventListener("input", calculate));
    calculate();
  });
}

function wireSmileComparisons() {
  document.querySelectorAll("[data-compare]").forEach((compare) => {
    const range = compare.querySelector("[data-compare-range]");
    const before = compare.querySelector("[data-compare-before]");
    const divider = compare.querySelector("[data-compare-divider]");
    const beforeImage = before.querySelector("img");

    function update() {
      const value = `${range.value}%`;
      beforeImage.style.width = `${compare.clientWidth}px`;
      before.style.width = value;
      divider.style.left = value;
    }

    range.addEventListener("input", update);
    window.addEventListener("resize", update);
    update();
  });
}

wireWhatsAppLinks();
wireQuoteForms();
wireSavingsCalculator();
wireSmileComparisons();

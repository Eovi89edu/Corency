


const API_BASE = "/api";

const amountInput      = document.getElementById("amount");
const baseSelect       = document.getElementById("baseCurrency");
const convertbtn       = document.getElementById("convertbtn");
const addTargetBtn     = document.getElementById("addTargetBtn");
const targetsContainer = document.getElementById("targetsContainer");

let currencies = {};
let rates      = {};


async function loadData() {
  try {
    const [curRes, rateRes] = await Promise.all([
     
      fetch(`${API_BASE}/currencies`),
      fetch(`${API_BASE}/latest`)
    ]);

    const curJson  = await curRes.json();
    const rateJson = await rateRes.json();

    currencies = curJson.data;
    rates = Object.fromEntries(
      Object.entries(rateJson.data).map(([code, info]) => [code, info.value])
    );

    fillSelect(baseSelect);
    baseSelect.value = "USD";

    ["EUR", "GBP", "JPY"].forEach(code => createTargetRow(code));

    convert();
  } catch (err) {
    console.error("Failed to load currency data:", err);
    targetsContainer.innerHTML = "<p>Error loading data.</p>";
  }
}


function fillSelect(select) {
  const fragment = document.createDocumentFragment();

  for (const [code, info] of Object.entries(currencies)) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${code} — ${info.name}`;
    fragment.appendChild(option);
  }

  select.appendChild(fragment);
}


function createTargetRow(defaultCode = "") {
  const row = document.createElement("div");
  row.className = "target-row";

  const select = document.createElement("select");
  select.className = "target-currency";
  fillSelect(select);
  if (defaultCode) select.value = defaultCode;
  select.addEventListener("change", convert);

  const value = document.createElement("span");
  value.className = "target-value";
  value.textContent = "—";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.className = "remove-target";
  removeBtn.addEventListener("click", () => {
    row.remove();
    convert();
  });

  row.append(select, value, removeBtn);
  targetsContainer.appendChild(row);
}


function formatMoney(value, code) {
  const digits = value > 0 && value < 1 ? 4 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  } catch {
    return `${value.toFixed(digits)} ${code}`;
  }
}


function convert() {
  const amount   = parseFloat(amountInput.value) || 0;
  const baseCode = baseSelect.value;
  const baseRate = rates[baseCode];
  if (!baseRate) return;

  const inUsd = amount / baseRate;

  targetsContainer.querySelectorAll(".target-row").forEach(row => {
    const select     = row.querySelector(".target-currency");
    const valueEl    = row.querySelector(".target-value");
    const targetCode = select.value;
    const targetRate = rates[targetCode];

    if (!targetRate) {
      valueEl.textContent = "—";
      return;
    }

    valueEl.textContent = formatMoney(inUsd * targetRate, targetCode);
  });
}


convertbtn.addEventListener("click", convert);

addTargetBtn.addEventListener("click", () => {
  createTargetRow();
  convert();
});


loadData();
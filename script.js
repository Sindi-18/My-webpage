"use strict";

// theme of red and black
const themeBtn = document.getElementById("theme-toggle");
const root = document.documentElement;

// Applies a theme and updates the button text.
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  themeBtn.setAttribute("aria-pressed", String(theme === "light"));
}
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { /* storage blocked */ }
applyTheme(savedTheme === "light" ? "light" : "dark");

themeBtn.addEventListener("click", function () {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
});

/* ===== Feature 2: Flip-card gallery =====
   Clicking (or pressing Enter/Space) toggles the .flipped class,
   which triggers the CSS rotateY(180deg) transition. */
document.querySelectorAll(".flip-card").forEach(function (card) {
  // Click to flip
  card.addEventListener("click", function () {
    const isFlipped = card.classList.toggle("flipped");
    card.setAttribute("aria-label",
      isFlipped
        ? card.getAttribute("aria-label").replace("Flip", "Unflip")
        : card.getAttribute("aria-label").replace("Unflip", "Flip")
    );
  });

  // Keyboard: Enter or Space also flips (accessibility)
  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});

/* ===== Feature 3: Expandable project details ===== */
document.querySelectorAll(".toggle-details").forEach(function (button) {
  button.addEventListener("click", function () {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const opening = panel.hidden; // hidden now means it is about to open
    panel.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
    button.textContent = opening ? "Hide details" : "Show details";
  });
});

/* ===== Feature 4 (compulsory): Contact form validation and preview ===== */
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const topicInput = document.getElementById("topic");
const messageInput = document.getElementById("message");
const summary = document.getElementById("form-summary");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // text@domain.tld

// Shows (or clears) the error message beside a field.
function setError(input, message) {
  document.getElementById(input.id + "-error").textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

// Returns true only if name, email and message are valid; trim() rejects spaces-only text.
function validateForm() {
  let valid = true;
  if (nameInput.value.trim() === "") { setError(nameInput, "Enter your name (spaces alone are not accepted)."); valid = false; }
  else setError(nameInput, "");

  if (!emailPattern.test(emailInput.value.trim())) { setError(emailInput, "Enter a valid email, for example name@example.com."); valid = false; }
  else setError(emailInput, "");

  if (messageInput.value.trim() === "") { setError(messageInput, "Enter a message (spaces alone are not accepted)."); valid = false; }
  else setError(messageInput, "");
  return valid;
}

// Builds the preview with textContent so typed text is never treated as HTML.
function showSummary() {
  summary.textContent = "";
  const heading = document.createElement("h3");
  heading.textContent = "Form validated";
  const note = document.createElement("p");
  note.textContent = "Your details passed validation in this browser. No message was sent.";
  summary.append(heading, note);

  const rows = [["Name", nameInput.value.trim()], ["Email", emailInput.value.trim()], ["Message", messageInput.value.trim()]];
  if (topicInput.value !== "") rows.splice(2, 0, ["Topic", topicInput.selectedOptions[0].textContent]);
  rows.forEach(function (row) {
    const p = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = row[0] + ": ";
    const value = document.createElement("span");
    value.textContent = row[1];
    p.append(label, value);
    summary.appendChild(p);
  });
  summary.hidden = false;
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // keep everything local, no page reload
  if (validateForm()) {
    showSummary();
  } else {
    summary.hidden = true;
    form.querySelector("[aria-invalid='true']").focus(); // jump to the first problem
  }
});

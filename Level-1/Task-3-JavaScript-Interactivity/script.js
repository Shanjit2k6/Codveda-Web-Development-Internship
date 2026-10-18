
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

dropdownBtn.addEventListener("click", () => {
  const isHidden = dropdownMenu.classList.toggle("hidden");
  dropdownBtn.setAttribute("aria-expanded", String(!isHidden));
});

// Dropdown closes when a menu link is clicked.
dropdownMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    dropdownMenu.classList.add("hidden");
    dropdownBtn.setAttribute("aria-expanded", "false");
  });
});

// Modal functionality.
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const featureBtn = document.getElementById("featureBtn");
const closeModal = document.getElementById("closeModal");
const modalDone = document.getElementById("modalDone");

function showModal() {
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

openModal.addEventListener("click", showModal);
featureBtn.addEventListener("click", showModal);
closeModal.addEventListener("click", hideModal);
modalDone.addEventListener("click", hideModal);

// Close modal when the user clicks the background.
modal.addEventListener("click", event => {
  if (event.target === modal) {
    hideModal();
  }
});

// Contact form validation.
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("messageError").textContent = "";
  document.getElementById("formStatus").textContent = "";

  let valid = true;

  if (name.length < 2) {
    document.getElementById("nameError").textContent =
      "Please enter at least 2 characters.";
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address.";
    valid = false;
  }

  if (message.length < 5) {
    document.getElementById("messageError").textContent =
      "Please enter a message of at least 5 characters.";
    valid = false;
  }

  if (valid) {
    document.getElementById("formStatus").textContent =
      "Form validated successfully! Demo only; nothing was sent.";

    contactForm.reset();
  }
});

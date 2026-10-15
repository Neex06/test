document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl =
    "https://hook.eu1.make.com/hscrjt25yv8vneshf3rjux2q912jhxws";

  const form = document.getElementById("booking-form");
  const status = document.getElementById("form-status");

  /*
   * Мобильное меню
   */
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("is-open");
      });
    });
  }

  /*
   * Автоматически подставляем выбранный предмет
   */
  const subjectSelect = document.getElementById("subject");

  document.querySelectorAll("[data-subject]").forEach((link) => {
    link.addEventListener("click", () => {
      const selectedSubject = link.dataset.subject;

      if (subjectSelect && selectedSubject) {
        subjectSelect.value = selectedSubject;
      }
    });
  });

  /*
   * Текущий год в подвале
   */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /*
   * Отправка заявки в Make
   */
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');

    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const subject = document.getElementById("subject")?.value || "";
    const format = document.getElementById("format")?.value || "";
    const message = document.getElementById("message")?.value.trim() || "";

    if (!name || !phone || !subject) {
      status.textContent = "Заполните обязательные поля.";
      status.style.color = "crimson";
      return;
    }

     const leadData = {
     name,
     phone,
     interested_subject: subject,
     preferred_format: format,
     goal_or_comment: message,
     submitted_at: new Date().toISOString()
};

    try {
      submitButton.disabled = true;
      submitButton.style.opacity = "0.7";

      status.textContent = "Отправка заявки...";
      status.style.color = "";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }

      form.reset();

      status.textContent =
        "Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
      status.style.color = "green";

    } catch (error) {
      console.error("Ошибка отправки заявки:", error);

      status.textContent =
        "Не удалось отправить заявку. Попробуйте ещё раз.";
      status.style.color = "crimson";

    } finally {
      submitButton.disabled = false;
      submitButton.style.opacity = "";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("studentForm");
    const submitBtn = document.getElementById("submitBtn");

    const idInput = document.getElementById("id");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const strengthFill = document.getElementById("strength-fill");
    const strengthText = document.getElementById("strength-text");

    //  UI helpers
    function showError(input, message) {
        const group = input.parentElement.parentElement;
        group.querySelector(".error-message").textContent = message;

        input.classList.add("error");
        input.classList.remove("success");

        const icon = input.parentElement.querySelector(".icon");
        icon.classList.add("error");
        icon.classList.remove("success");
    }

    function showSuccess(input) {
        const group = input.parentElement.parentElement;
        group.querySelector(".error-message").textContent = "";

        input.classList.remove("error");
        input.classList.add("success");

        const icon = input.parentElement.querySelector(".icon");
        icon.classList.remove("error");
        icon.classList.add("success");
    }

    // 🔹 Validators
    function validateId() {
        const id = idInput.value.trim();

        if (id === "") {
            showError(idInput, "ID required");
            return false;
        }

        if (!/^\d+$/.test(id)) {
            showError(idInput, "Only numbers allowed");
            return false;
        }

        showSuccess(idInput);
        return true;
    }

    function validateUsername() {
        const username = usernameInput.value.trim();

        if (!/^[A-Za-z]+(_[A-Za-z]+)*$/.test(username)) {
            showError(usernameInput, "Username must contain only letters (Min len 3) and single underscores (e.g., shyam_kumar)");
            return false;
        }

        showSuccess(usernameInput);
        return true;
    }   

    function validateEmail() {
        const email = emailInput.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(emailInput, "Invalid email");
            return false;
        }

        showSuccess(emailInput);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;

        if (password.includes(" ")) {
            showError(passwordInput, "No spaces allowed");
            return false;
        }

        const strong = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!strong.test(password)) {
            showError(passwordInput, "Weak password");
            return false;
        }

        showSuccess(passwordInput);
        return true;
    }

    // 🔹 Password strength meter
    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        let strength = 0;

        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/\d/.test(val)) strength++;
        if (/[@$!%*?&]/.test(val)) strength++;

        let width = strength * 25;
        strengthFill.style.width = width + "%";

        if (strength <= 1) {
            strengthFill.style.background = "red";
            strengthText.textContent = "Weak";
        } else if (strength === 2) {
            strengthFill.style.background = "orange";
            strengthText.textContent = "Medium";
        } else {
            strengthFill.style.background = "green";
            strengthText.textContent = "Strong";
        }
    });

    // 🔹 Check full form
    function checkForm() {
        const valid =
            validateId() &&
            validateUsername() &&
            validateEmail() &&
            validatePassword();

        submitBtn.disabled = !valid;
    }

    // 🔹 Events
    idInput.addEventListener("input", checkForm);
    usernameInput.addEventListener("input", checkForm);
    emailInput.addEventListener("input", checkForm);
    passwordInput.addEventListener("input", checkForm);

    form.addEventListener("submit", (e) => {
        if (submitBtn.disabled) {
            e.preventDefault();
        }
    });

});
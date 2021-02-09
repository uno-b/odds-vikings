/**
 *
 * Validate text input
 *
 * @param {string} value - text input field value
 *
 * @returns {boolean}
 */
function validateInput(value) {
	return value && value != "" ? true : false;
}

/**
 * Get the current date in array format ['YYYY','MM', 'DD']
 */
function getCurrentDateArr() {
	const currentFullDate = new Date();
	const currentYMD = [
		currentFullDate.getFullYear().toString(),
		(currentFullDate.getMonth() + 1).toString().padStart(2, "0"),
		currentFullDate.getDate().toString().padStart(2, "0"),
	];
	return currentYMD;
}

/**
 * Validate date of birth to be less than current date
 *
 * @param {string} date - Date of Birth input field value
 *
 * @returns {boolean}
 */
function validateDOB(date) {
	const userDOB = date.split("-");
	const currentYMD = getCurrentDateArr();
	if (userDOB.length < 3) return false;
	if (userDOB[0] > currentYMD[0]-18) return false;
	if (userDOB[1] > currentYMD[1] && userDOB[0] === currentYMD[0]) return false;
	if (
		userDOB[2] > currentYMD[2] &&
		userDOB[1] === currentYMD[1] &&
		userDOB[0] === currentYMD[0]
	)
		return false;
	return true;
}

/**
 *
 * Validate email
 *
 * @param {string} email - email input field value
 *
 * @returns {boolean}
 */
function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

/**
 *
 * Validate password
 *
 * @param {string} password - Password input field value
 *
 * @returns {{isValid: boolean, strength: number}} Acceptability and password strength
 */
function validatePassword(password) {
	if (!validateInput(password)) return { isValid: false, strength: 0 };
	if (password.length < 6) return { isValid: false, strength: 1 };
	if (password.length < 8) return { isValid: true, strength: 2 };
	if (password.length < 10) return { isValid: true, strength: 3 };
	return { isValid: true, strength: 4 };
}

/**
 * Password strength description
 *
 * @param {number} numOfBar - Number of bars to create to describe password strength
 * @param {string} text - password strength description
 * @param {string} backgroundColor
 */
function passwordStrength(numOfBar, text, backgroundColor) {
	const strengthBar = $(".strenth-indicators");
	const strengthText = $(".strenth-text");
	let bars = new Array(numOfBar)
		.fill(null)
		.map(() =>
			$("<span></span>")
				.addClass("sterht-ind")
				.css("background", backgroundColor)
		);

	strengthBar.html(bars);
	strengthText.text(text).css("color", backgroundColor);
}

/**
 *
 * Validate confirm password matches password
 *
 * @param {string} password - Password input field value
 * @param {string} confirmPassword - confrim password input field value
 *
 * @returns {{isMatch: boolean, msg: number}} Acceptability and password strength
 */
function validateConfirmPassword(password, confirmPassword) {
	if (!validateInput(confirmPassword)) return { isMatch: false, msg: "" };
	if (password.length && confirmPassword === password)
		return { isMatch: true, msg: "Matches Password" };
	return { isMatch: false, msg: "Doesn't match the password" };
}

/**
 * Validate the user phone number e.g +1234567890
 *
 * @param {string} number - Phone number input field value
 *
 * @returns {boolean}
 */
function validatePhoneNumber(number) {
	if (!validateInput(number)) return true;
	const re = /^\+[0-9]{8,15}$/;
	return re.test(String(number));
}

/**
 * Validate the checkbox for terms and conditions
 *
 * @param {string} value - checkbox background color "rga(X,Y,Z)"
 *
 * @returns {boolean}
 */
function validateCheckbox(value) {
	if (value === "rgb(14, 132, 17)") return true;
	return false;
}

/**
 * Output validation state of input field (red or green borders)
 *
 * @param {string} inputId - id of the input field
 * @param {boolean} isValid - validation state of field
 */
function validationState(inputId, isValid) {
	if (!isValid) {
		$(inputId).css("border-color", "#dc3545");
	} else {
		$(inputId).css("border-color", "#28a745");
	}
}

$(function () {
	// Update email error display (hide on email change)
	$("#email").on("input", function (e) {
		$("#error-message").addClass("d-none");
	});

	// Set max date limit as 18 years from current date
	$("#DOB").attr("max", function (oldValue) {
		const currentDateArr = getCurrentDateArr();
		return `${currentDateArr[0]-18}-${currentDateArr[1]}-${currentDateArr[2]}`;
	});

	// Show password strength
	$("#password").on("input", function (e) {
		const passValid = validatePassword(this.value);
		switch (passValid.strength) {
			case 0:
				$(".strenth-indicators").empty();
				$(".strenth-text").empty();
				break;
			case 1:
				passwordStrength(passValid.strength, "Password Too Short", "#dc3545");
				break;
			case 2:
				passwordStrength(passValid.strength, "Password Weak", "#ffc107");
				break;
			case 3:
				passwordStrength(passValid.strength, "Password Average", "#17a2b8");
				break;
			case 4:
				passwordStrength(passValid.strength, "Password Strong", "#28a745");
				break;
			default:
				break;
		}
		$("#confirm-password").trigger("input");
	});

	// Check for password match
	$("#confirm-password").on("input", function (e) {
		const validation = validateConfirmPassword(
			$("#password").val(),
			$(this).val()
		);
		$(".confirm-password-text")
			.text(validation.msg)
			.css("color", validation.isMatch ? "#28a745" : "#dc3545");
	});

	// Enable ore Disable sign up button on agreed to terms and conditions
	$(".cheakbox-area").on("click", function (e) {
		if (validateCheckbox($("#mock-agreed").css("background-color"))) {
			$(".submit-btn-area button").attr("disabled", true);
		} else {
			$(".submit-btn-area button").attr("disabled", false);
		}
	});

	// Validate and process sign up Form data
	$("#sign-up-form").on("submit", async function (e) {
		e.preventDefault();
		let canSubmit = true;

		// Validate input fields before submit

		if (validateInput(this["firstname"].value)) {
			validationState("#firstname", true);
		} else {
			canSubmit = false;
			validationState("#firstname", false);
		}

		if (validateInput(this["lastname"].value)) {
			validationState("#lastname", true);
		} else {
			canSubmit = false;
			validationState("#lastname", false);
		}

		if (validateDOB(this["DOB"].value)) {
			validationState("#DOB", true);
		} else {
			canSubmit = false;
			validationState("#DOB", false);
		}

		if (validateInput(this["countryOfResidence"].value)) {
			validationState("#countryOfResidence", true);
		} else {
			canSubmit = false;
			validationState("#countryOfResidence", false);
		}

		if (validateEmail(this["email"].value)) {
			validationState("#email", true);
		} else {
			canSubmit = false;
			validationState("#email", false);
		}

		if (validateInput(this["username"].value)) {
			validationState("#username", true);
		} else {
			canSubmit = false;
			validationState("#username", false);
		}

		if (validatePassword(this["password"].value).isValid) {
			validationState("#password", true);
		} else {
			canSubmit = false;
			validationState("#password", false);
		}

		if (
			validateConfirmPassword(
				this["password"].value,
				this["confirm-password"].value
			).isMatch
		) {
			validationState("#confirm-password", true);
		} else {
			canSubmit = false;
			validationState("#confirm-password", false);
		}

		if (validatePhoneNumber(this["phone"].value)) {
			validationState("#phone", true);
		} else {
			canSubmit = false;
			validationState("#phone", false);
		}

		if (validateCheckbox($("#mock-agreed").css("background-color"))) {
			validationState("#mock-agreed", true);
		} else {
			canSubmit = false;
			validationState("#mock-agreed", false);
		}

		if (canSubmit) {
			const user = {
				firstname: this["firstname"].value,
				lastname: this["lastname"].value,
				dateOfBirth: this["DOB"].value,
				countryOfResidence: this["countryOfResidence"].value,
				email: this["email"].value.toLowerCase(),
				username: this["username"].value,
				password: this["password"].value,
				referralID: this["ref-number"].value,
				phone: this["phone"].value,
			};

			const res = await registerUser(user);

			if (res.onSuccess) {
				await loginUser(user.email, user.password);
				await sendVerifyEmail()
				$("#sign-up-form").trigger("reset");
				// Navigate to successful registeration page
				window.location.href = "./registration.html";
			} else {
				$("#error-message").text(res.error.message).removeClass("d-none");
			}
		}
	});
});

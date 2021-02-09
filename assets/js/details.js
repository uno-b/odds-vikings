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
	// Remove name css attribute for display name fontsize
	$(".username-display").css("font-size", "inherit");

	// logout listener
	$(".logout-btn").on("click", async function (e) {
		await logoutUser();
	});

	// Show password strength
	$("#new-password").on("input", function (e) {
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
		$("#error-message").addClass("d-none");
	});

	// Check for password match
	$("#confirm-password").on("input", function (e) {
		const validation = validateConfirmPassword(
			$("#new-password").val(),
			$(this).val()
		);
		$(".confirm-password-text")
			.text(validation.msg)
			.css("color", validation.isMatch ? "#28a745" : "#dc3545");
	});

	// Validate and process sign up Form data
	$("#reset-password-form").on("submit", async function (e) {
		e.preventDefault();
		let canSubmit = true;

		// Validate input fields before submit

		if (validateInput(this["old-password"].value)) {
			validationState("#old-password", true);
		} else {
			canSubmit = false;
			validationState("#old-password", false);
		}

		if (validatePassword(this["new-password"].value).isValid) {
			validationState("#new-password", true);
		} else {
			canSubmit = false;
			validationState("#new-password", false);
		}

		if (
			validateConfirmPassword(
				this["new-password"].value,
				this["confirm-password"].value
			).isMatch
		) {
			validationState("#confirm-password", true);
		} else {
			canSubmit = false;
			validationState("#confirm-password", false);
		}

		if (canSubmit) {
			const email = currentUser.email
			const oldPassword = this["old-password"].value;
			const newPassword = this["new-password"].value;
			if (oldPassword === newPassword) {
				$("#error-message")
					.text("New password cannot be same as current password.")
					.removeClass("d-none");
				return;
			}

			const res = await changePassword(oldPassword, newPassword);
			// positive response got from server
			console.log(currentUser)
			if (res.onSuccess) {
				await loginUser(email, newPassword);
				$("#reset-password-form").trigger("reset");
				$("#new-password").trigger("input");
				$("#confirm-password").trigger("input");
				$("#error-message")
					.text("Password successfully changed")
					.addClass("text-success")
					.removeClass("d-none text-danger");
				setTimeout(function () {
					$("#error-message")
						.text("")
						.addClass("d-none text-danger")
						.removeClass("text-success");
				}, 5000);
				console.log("success");
			} else {
				$("#error-message")
					.text(res.error.message || "An error occured")
					.removeClass("d-none");
				setTimeout(function () {
					$("#error-message").text("").addClass("d-none");
				}, 5000);
			}
		}
	});
});

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
    $("#email").on("input", function (e) {
		$("#error-message").addClass("d-none");
    });

    $("#password").on("input", function (e) {
		$("#error-message").addClass("d-none");
    });
    
	$("#login-form").on("submit", async function (e) {
		e.preventDefault();
		const canSubmit = true;

		if (validateEmail(this["email"].value)) {
			validationState("#email", true);
		} else {
			canSubmit = false;
			validationState("#email", false);
		}

		if (validateInput(this["password"].value)) {
			validationState("#password", true);
		} else {
			canSubmit = false;
			validationState("#password", false);
        }
        
        if(canSubmit){
            const res = await loginUser(this["email"].value, this["password"].value)
            if (res.onSuccess) {
				$("#login-form").trigger("reset");
				// Navigate to successful registeration page
				window.location.href = "./details.html";
			} else {
				$("#error-message").text(res.error.message).removeClass("d-none");
			}
        }
	});
});

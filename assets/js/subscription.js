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

$(function () {
	$("#subscribe-form").on("submit", async function (e) {
		e.preventDefault();
		const email = (this["subscribe-email"].value).toLowerCase();
		if (!validateEmail(email)) {
            displayInfo(false, "Invalid email address")
			return;
		}

        const res = await addEmailToSub(email);
        
		if (!res.onSuccess) {
            displayInfo(false, res.error.message)
			return;
        }
        
        displayInfo(true, "Subscription successful")
        this.reset();
	});
});

function displayInfo(success, msg) {
	$("#subscibe-info").text(msg);
	const cssClass = "d-none " + (success ? "text-success" : "text-danger");
	$("#subscibe-info").toggleClass(cssClass);

	setTimeout(function () {
		$("#subscibe-info").toggleClass(cssClass);
	}, 5000);
}

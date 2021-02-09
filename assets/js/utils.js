/**
 *
 * @param {Object} userData - user data to be registered
 *
 * @returns {Promise<Object>}
 */
function registerUser(userData) {
	return $.post(
		location.hostname === "localhost"
			? "http://localhost:5002/oddsvikings-v1/us-central1/app/auth/signup"
			: "https://us-central1-oddsvikings-v1.cloudfunctions.net/app/auth/signup",
		userData,
		function (data, status) {
			return { ...data, status };
		}
	);
}

/**
 * Firebase web login function
 *
 * @param {string} email - user's email
 * @param {string} password - user's password
 *
 * @returns {Promise<Object>}
 */
function loginUser(email, password) {
	return auth
		.signInWithEmailAndPassword(email, password)
		.then(({ user }) => {
			return user.getIdToken(/* forceRefresh */ true).then((idToken) => {
				// console.log(idToken);
				return $.ajax({
					url:
						location.hostname === "localhost"
							? "http://localhost:5002/oddsvikings-v1/us-central1/app/auth/login"
							: "https://us-central1-oddsvikings-v1.cloudfunctions.net/app/auth/login",
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", `Bearer ${idToken}`);
					},
					success: (data) => data,
				});
			});
		})
		.catch((error) => {
			return { error, onSuccess: false, data: null };
		});
}

function logoutUser() {
	return auth
		.signOut()
		.then(() => {
			// Sign-out successful.
			// console.log("Signed out")
		})
		.catch((error) => {
			// An error happened.
		});
}

function changePassword(oldPassword, newPassword) {
	return currentUser
		.getIdToken(/* forceRefresh */ true)
		.then(function (idToken) {
			// Send token to your backend via HTTPS
			// ...
			return $.ajax({
				url:
					location.hostname === "localhost"
						? "http://localhost:5002/oddsvikings-v1/us-central1/app/auth/reset-password"
						: "https://us-central1-oddsvikings-v1.cloudfunctions.net/app/auth/reset-password",
				type: "PUT",
				data: { oldPassword, newPassword },
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", `Bearer ${idToken}`);
				},
				success: (data) => data,
			});
		})
		.catch(function (error) {
			// Handle error
			return { error, onSuccess: false, data: null };
		});
}

function sendVerifyEmail() {
	return currentUser
		.getIdToken(/* forceRefresh */ true)
		.then(function (idToken) {
			// Send token to your backend via HTTPS
			// ...
			return $.ajax({
				url:
					location.hostname === "localhost"
						? "http://localhost:5002/oddsvikings-v1/us-central1/app/auth/verify-email"
						: "https://us-central1-oddsvikings-v1.cloudfunctions.net/app/auth/verify-email",
				type: "GET",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", `Bearer ${idToken}`);
				},
				success: (data) => data,
			});
		})
		.catch(function (error) {
			// Handle error
			return { error, onSuccess: false, data: null };
		});
}

function addEmailToSub(email) {
	const response = { error: null, onSuccess: false };
	return db
		.collection("subscribers")
		.doc(email)
		.get()
		.then((doc) => {
			if (doc.exists) {
				response.error = { message: "Email already exists" };
				return response;
			} else {
				return db
					.collection("subscribers")
					.doc(email)
					.set({ email: email })
					.then((docRef) => {
						// console.log("Document written with ID: ", docRef.id);
						response.onSuccess = true;
						return response;
					})
					.catch((error) => {
						// console.error("Error adding document: ", error);
						response.error = error;
						return response;
					});
			}
		})
		.catch((error) => {
			// console.log("Error getting documents: ", error);
			response.error = error;
			return response;
		});
}

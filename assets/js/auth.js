// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
	apiKey: "AIzaSyBODLazexs5x7knqtkK2PyurapHDQW5B_c",
	authDomain: "oddsvikings-v1.firebaseapp.com",
	projectId: "oddsvikings-v1",
	// storageBucket: "oddsvikings-v1.appspot.com",
	messagingSenderId: "346324369176",
	appId: "1:346324369176:web:d897aba467818d7447686d",
	measurementId: "G-87HWRQ0LY8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// firebase.auth().useEmulator("http://localhost:9099/");
const auth = firebase.auth();
if (location.hostname === "localhost") {
	auth.useEmulator("http://localhost:9099/");
  }

const db = firebase.firestore();
if (location.hostname === "localhost") {
	db.useEmulator("localhost", 5003);
  }

const commonRoutes = [
	"/",
	"/index.html",
	"/how-it-works.html",
	"/registration.html",
	"/404.html",
	"/cookies.html",
	"/terms.html",
	"/policy.html",
];

let currentUser = null;
auth.onAuthStateChanged((user) => {
	// console.log(user);
	currentUser = user;
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		if (window.location.pathname === "/login.html") {
			window.location.href = "/details.html";
		}

		if (window.location.pathname === "/sign-up.html") {
			if (user.emailVerified) {
				// window.location.href = "/registration.html";
				window.location.href = "/";
			}
		}

		if (window.location.pathname === "/details.html") {
			if (!user.emailVerified) {
				window.location.href = "/registration.html";
				return;
			}
			$(".username-display").text(user.displayName);
			$("#username-input").val(user.displayName);
			$("main").removeClass("d-none");
		}

		if (commonRoutes.includes(window.location.pathname)) {
			$(".user-section").removeClass("d-none");
		}
		// ...
	} else {
		// User is signed out
		// ...
		if (window.location.pathname === "/details.html") {
			window.location.href = "/login.html";
		}

		if (commonRoutes.includes(window.location.pathname)) {
			$(".visitor-section").removeClass("d-none");
		}
	}
	// console.log(window.location.pathname)
});

$(".logout-btn").on("click", async function(e){
	await logoutUser()
	$(".user-section").addClass("d-none")
})
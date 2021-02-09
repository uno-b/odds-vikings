$(function () {
    $(".logout-btn").on("click", async function(e){
        await logoutUser()
        $(".user-section").addClass("d-none")
    })

    $("#resend-link").on("click", async function (){
        res = await sendVerifyEmail()
        // console.log(res)
        if(res.onSuccess){
            $("#display-info").removeClass("d-none")
            setTimeout(function () {
                $("#display-info").addClass("d-none")
            }, 5000);
        }
    })
})
document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener("hashchange", function (event) {
        const currentHash = window.location.hash;
        if (currentHash === "#section-channel-insights"){
            const channel_id = sessionStorage.getItem("channel_id");
            console.log(channel_id)
        }
    })

    const initialHash = window.location.hash;

    if (initialHash === "#section-channel-insights"){
        const channel_id = sessionStorage.getItem("channel_id");
        console.log(channel_id)
    }
});
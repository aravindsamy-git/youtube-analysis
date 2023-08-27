function updateDateTime() {
    const dateTimeElement = document.getElementById("currentDateTime");
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedDateTime = now.toLocaleDateString(undefined, options);
    dateTimeElement.textContent = formattedDateTime;
}

// Call the function initially
updateDateTime();

// Update the date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);
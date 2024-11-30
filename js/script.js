document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "d4757caf2fda97c1e9db543db552fe8d";
    const searchButton = document.getElementById("search-btn");
    const cityInput = document.getElementById("city-input");
    const suggestionsBox = document.getElementById("suggestions");
    const prayerTimesContainer = document.getElementById("prayer-times");
    const cities = [
        "Dhaka",
        "Chattogram",
        "Khulna",
        "Rajshahi",
        "Barisal",
        "Sylhet",
        "Mymensingh",
        "Rangpur",
        "Narayanganj",
        "Gazipur",
        "Cumilla",
        "Bogura",
        "Tangail",
        "Pabna",
        "Jessore",
        "Cox's Bazar",
        "Narsingdi",
        "Jamalpur",
        "Kushtia",
        "Faridpur",
        "Manikganj",
        "Madaripur",
        "Shariatpur",
        "Munshiganj",
        "Chandpur",
        "Brahmanbaria",
        "Habiganj",
        "Maulvibazar",
        "Sunamganj",
        "Feni",
        "Lalmonirhat",
        "Nilphamari",
        "Kurigram",
        "Thakurgaon",
        "Panchagarh",
        "Dinajpur",
        "Gaibandha",
        "Sirajganj",
        "Natore",
        "Chapainawabganj",
        "Naogaon",
        "Joypurhat",
        "Magura",
        "Jhenaidah",
        "Narail",
        "Satkhira",
        "Bagerhat",
        "Pirojpur",
        "Jhalokati",
        "Bhola",
        "Barguna",
        "Sherpur",
        "Netrokona",
        "Meherpur",
        "Chuadanga",
        "Bandarban",
        "Khagrachari",
        "Rangamati"
    ];
    

    function convertTo12HourFormat(time) {
        let [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    cityInput.addEventListener("input", () => {
        const inputText = cityInput.value.toLowerCase();
        suggestionsBox.innerHTML = "";
        if (inputText) {
            const filteredCities = cities.filter(city => city.toLowerCase().startsWith(inputText));
            filteredCities.forEach(city => {
                const div = document.createElement("div");
                div.classList.add("suggestion-item");
                div.textContent = city;
                div.addEventListener("click", () => {
                    cityInput.value = city;
                    suggestionsBox.innerHTML = "";
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(div);
            });
            if (filteredCities.length > 0) {
                suggestionsBox.style.display = "block";
            } else {
                suggestionsBox.style.display = "none"; 
            }
        } else {
            suggestionsBox.style.display = "none"; 
        }
    });

    searchButton.addEventListener("click", () => {
        const city = cityInput.value;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},BD&units=metric&appid=${apiKey}`;
        const prayerApiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=1`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    document.getElementById("weather-info").innerHTML = `
                        <h4><i class="fas fa-info-circle"></i> Weather and date in ${data.name}</h4>
                        <table border="1">
                            <tr>
                                <td><i class="fas fa-map-marker-alt"></i> Location</td>
                                <td>${data.name}</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-thermometer-half"></i> Temperature</td>
                                <td>${data.main.temp}°C</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-cloud-sun"></i> Condition</td>
                                <td>${data.weather[0].description}</td>
                            </tr>
                        </table>
                        <div>
                            <h2><b>Date & Time</b></h2>
                            <h3><i class="fas fa-clock"></i> ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</h3>
                        </div>
                    `;
                } else {
                    alert("City not found. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });

        fetch(prayerApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    const timings = data.data.timings;
                    prayerTimesContainer.innerHTML = `
                        <h5> <i class="fas fa-pray"></i> Prayer Times for ${city}</h5>
                        <table border="1" cellpadding="10" cellspacing="0">
                            <tr>
                                <th>Prayer</th>
                                <th>Time</th>
                            </tr>
                            <tr>
                                <td><i class="fas fa-moon"></i> Fajr</td>
                                <td>${convertTo12HourFormat(timings.Fajr)}</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-sun"></i> Dhuhr</td>
                                <td>${convertTo12HourFormat(timings.Dhuhr)}</td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-hands-praying"></i> Asr</td>
                                <td>${convertTo12HourFormat(timings.Asr)}</td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-person-praying"></i> Maghrib</td>
                                <td>${convertTo12HourFormat(timings.Maghrib)}</td>
                            </tr>
                            <tr>
                                <td><i class="fas fa-star"></i> Isha</td>
                                <td>${convertTo12HourFormat(timings.Isha)}</td>
                            </tr>
                        </table>
                    `;
                } else {
                    prayerTimesContainer.innerHTML = `<p>Could not retrieve prayer times for ${city}. Please try again.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching prayer times:", error);
                prayerTimesContainer.innerHTML = `<p>Error retrieving data. Please try again later.</p>`;
            });
    });
});

const error_no_data = "No data to show.";
const error_invalid_tracking = "Invalid tracking number provided."
const u = "https://fast-badlands-57732.herokuapp.com/pastebin.com/raw/Fhw52FMF";

$(document).ready(() => {
   const searchParams = $(location)[0].search;
   if (searchParams.length >= 1) {
    const arrParams = searchParams.substr(1).split("&");
    let slug = '';
    for (let i=0; i<arrParams.length; i++) {
        let entry=arrParams[i];
        if (entry.includes("=") && entry.includes("track")) {
           slug = entry.split('track=').pop(); 
        }
    }
    prepareTracking();
    $("#shipmentId").val(slug);
    trackShipmentWithTrackingNumber(slug);
   } 
});

$("#trackOrder").click(() => {
    prepareTracking();
    const userTrackingNumValue = $("#shipmentId").val();
    try {
        validateUserInputFormat(userTrackingNumValue);
        trackShipmentWithTrackingNumber(userTrackingNumValue);
    } catch (exception) {
        showErrorMessage(exception);
        clearTracking();
    }
});

function prepareTracking() {
    clearErrors();
    clearTracking();
    startLoader();
}

function trackShipmentWithTrackingNumber(trackingNum) {
    fetchSchema(u).then((response) => response.json())
    .then((data) => {
        const schema = data.entries;
        if (schema.length >= 1) {
            const currentItems = schema.filter(shipment => shipment.trackingNum === trackingNum);
            if (currentItems.length == 1) {
                clearTracking();
                drawShippingEntries(currentItems[0]);
            } else {
                showErrorMessage(error_invalid_tracking);
                clearTracking();
            }
        } else {
            showErrorMessage(error_no_data);
            clearTracking();
        }
    })
    .catch((error) => {
        showErrorMessage(error_no_data);
        //console.error('Error fetching resource', error);
        clearTracking();
        });
}

function showErrorMessage(text) {
    $("#message-container").append('<div class="alert alert-danger" role="alert">' + text + '</div>');
}

function fetchSchema(url) {
    return fetch(url, {
        headers: {
            'Content-Type': 'application-json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

function drawShippingEntries(shippingEntries) {
    if (shippingEntries.steps.length >= 1) {
        shippingEntries.steps.sort((a, b) => (a.date > b.date) ? -1 : 1);
        shippingEntries.steps.forEach(shippingEntry => {
            const shippingStatus = shippingEntry.status;
            let trackingLocationClass;
            let dotClass = "";
            switch (shippingStatus) {
                case "BLUE":
                    trackingLocationClass = "style-two";
                    break;
                case "GREEN":
                    trackingLocationClass = "";
                    break;
                case "GREY":
                    trackingLocationClass = "style-three";
                    dotClass = '<span class="dott"></span>';
                    break;        
            }
            const shippingDateTime = shippingEntry.dateTime;
            const date = new Date(shippingDateTime);
            const dateString = date.toDateString().split(" ");
            const shippingTitle = shippingEntry.title;
            const shippingDescription = shippingEntry.description;
            $("#tracking-info-detail").append(
                '<div class="tracking-box">' +
                    '<div class="tracking-time-box">'+
                        '<div class="tracking-time">' + dateString[1] + " " + dateString[2] + ", " + dateString[3] + '</div>' +
                        '<span>' + date.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" }) + '</span>' +
                    '</div>' +    
                    '<div class="tracking-location ' + trackingLocationClass + "\"" + '>' + 
                        dotClass +
                        '<strong>' + shippingTitle + '</strong>' +
                        shippingDescription +
                    '</div>' + 
                '</div>'
            );
        });
    }
}

function clearErrors() {
    $(".alert").remove();
}

function clearTracking() {
    $("#tracking-info-detail").empty();
}

function startLoader() {
    $('#tracking-info-detail').append(
        '<div class="d-flex justify-content-center">' +
          '<div class="spinner-grow text-danger" style="width: 3rem; height: 3rem;" role="status">' +
            '<span class="sr-only">Loading...</span>' +
          '</div>' +
        '</div>');
}
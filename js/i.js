$("#searchNow").click(() => {
    const trackingNum = $("#trackingNum").val();
    navigateToSearchOnTrackingPage(trackingNum);
})

function displayErrorMessage(errorMessage) {
    const message = errorMessage.message;
    const alertContainerWithText =
    '<div class="alert alert-danger" role="alert">' +
       message +
     '</div>';
     $("#header-description").append(alertContainerWithText);
}

function navigateToSearchOnTrackingPage(trackingNum) {
  try {
      validateUserInputFormat(trackingNum);
      navigateToTrack(trackingNum);
  } catch (e) {
    displayErrorMessage(e);
  }
}

function navigateToTrack(trackingNum) {
    window.location.href = "track.html?track=" + trackingNum;
}
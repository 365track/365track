const error_invalid_format = "Invalid format provided. Please use the T- prefix.";

function validateUserInputFormat(userTrackingNum) {
    if (userTrackingNum == undefined 
        || userTrackingNum == null 
        || userTrackingNum.trim() == ""
        || !(userTrackingNum.includes("T-"))
        ) {
            throw new Error(error_invalid_format);
    }
}
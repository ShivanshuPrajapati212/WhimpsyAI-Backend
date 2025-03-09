function isMoreThan24Hours(timestamp) {
    const givenTime = new Date(timestamp).getTime(); // Convert to milliseconds
    const currentTime = Date.now(); // Current time in milliseconds
    const difference = Math.abs(currentTime - givenTime); // Absolute difference

    return difference >= 24 * 60 * 60 * 1000; // Check if difference is greater than 24 hours
}

module.exports = { isMoreThan24Hours }
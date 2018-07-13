export function getMonthNameFromMonthNumber(dateNumber) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return monthNames[dateNumber];
}

export function getDayOfWeekFromDayNumber(dayNumber) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return dayNames[dayNumber];
}
export function formatDate(dateTime) {
    if (!dateTime) return null; // Handle null or undefined values
  
    const [date, time] = dateTime.split(' '); // Split the dateTime string
    const [year, month, day] = date.split('-'); // Split the date into components
    let [hours, minutes, seconds] = time.split(':'); // Split the time into components
    let formattedDate;
    let formattedTime;
  
    // Convert 24-hour format to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format (handle 0 as 12)
  
     formattedDate = `${day}/${month}/${year.slice(-2)}`; // Format the date as DD/MM/YY
     formattedTime = `${hours}:${minutes}:${seconds} ${period}`; // Combine time in 12-hour format
  
    return { date: formattedDate, time: formattedTime, period };
  }
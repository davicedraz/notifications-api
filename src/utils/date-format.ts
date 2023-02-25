export function formatDateWithTimezone(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60)
    .toString()
    .padStart(2, '0');
  const timezoneMinutes = Math.abs(timezoneOffset % 60).toString().padStart(2, '0');
  const timezoneSign = timezoneOffset >= 0 ? '-' : '+';
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} GMT${timezoneSign}${timezoneHours}${timezoneMinutes}`;
  return formattedDate;
}
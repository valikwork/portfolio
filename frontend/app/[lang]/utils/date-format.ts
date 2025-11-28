export function formatDateFull(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function formatMonthYear(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options);
}

export const timeDuration = (
  startDateString: string,
  endDateString: string
) => {
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth() + 1; // +1 to include the end month

  if (months < 0) {
    years--;
    months += 12;
  }

  // Convert 12 months to 1 year
  if (months >= 12) {
    years++;
    months -= 12;
  }

  const yearStr = years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} mo${months > 1 ? "s" : "n"}` : "";

  return [yearStr, monthStr].filter(Boolean).join(" ");
};

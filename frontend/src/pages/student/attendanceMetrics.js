export function getAverageAttendance(attendance) {
  if (attendance.length === 0) {
    return null;
  }

  return Math.round(
    attendance.reduce(
      (sum, item) =>
        sum + Number(item.percentage || 0),
      0
    ) / attendance.length
  );
}

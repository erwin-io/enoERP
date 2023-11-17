export const convertNotationToObject = (notation: string, nestedValue):any => {
    let object = {}
    let pointer = object;
    notation.split('.').map( (key, index, arr) => {
      pointer = (pointer[key] = (index == arr.length - 1? nestedValue: {}))
    });
    return object;
}


export const generateSchoolYear = (startYear: number = 1950, pair = false) => {
  var currentYear = new Date().getFullYear(), years = [];
  startYear = startYear || 1980;
  while ( startYear <= currentYear ) {
      startYear++;
      if(pair) {
        const year1 = (startYear) - 1;
        const year2 = startYear;
        years.push(`${year1}-${year2}`);
      } else {
        years.push(startYear);
      }
  }
  return years.reverse();
}

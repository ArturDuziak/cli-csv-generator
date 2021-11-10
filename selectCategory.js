const readLineSync = require("readline-sync");

function selectCategory(items, message) {
  if (!items || !items.length) {
    return -1;
  }

  const MAX_ITEMS = 10,
    MAX_PAGE_INDEX = Math.ceil(items.length / MAX_ITEMS) - 1;

  let pageIndex = 0;
  while (true) {
    const PAGE_ITEMS = [];
    let indexPrev = -1,
      indexNext = -1;
    if (pageIndex > 0) {
      PAGE_ITEMS.push(`(PREVIOUS ${MAX_ITEMS} items)`);
      indexPrev = PAGE_ITEMS.length - 1;
    }
    Array.prototype.push.apply(
      PAGE_ITEMS,
      items.slice(pageIndex * MAX_ITEMS, (pageIndex + 1) * MAX_ITEMS)
    );
    if (pageIndex < MAX_PAGE_INDEX) {
      PAGE_ITEMS.push(
        `(NEXT ${
          pageIndex < MAX_PAGE_INDEX - 1 ? MAX_ITEMS : items.length - MAX_ITEMS * (pageIndex + 1)
        } item(s))`
      );
      indexNext = PAGE_ITEMS.length - 1;
    }

    const index = readLineSync.keyInSelect(PAGE_ITEMS, message);
    if (indexPrev !== -1 && index === indexPrev) {
      pageIndex--;
    } else if (indexNext !== -1 && index === indexNext) {
      pageIndex++;
    } else {
      return index === -1 ? index : index + pageIndex * MAX_ITEMS - (indexPrev === -1 ? 0 : 1);
    }
  }
}

module.exports = { selectCategory };

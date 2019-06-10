/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/
   
// Holds list of books from html.
const bookList = document.getElementsByClassName("book-item");

// Create and append a search element to the page.
const search = document.createElement('div');
search.className = "book-search";
search.innerHTML = "<input id=\"input\" type=\"search\" value=\"\" name=\"book_search\" placeholder=\"Search for atudents...\"><button id=\"button\" type=\"submit\" name=\"book_search\">search</button>"
document.getElementsByClassName("page-header")[0].appendChild(search);

// Create a message for when there are no search resullts.
const noResults = document.createElement('h1');
noResults.className = "result";
noResults.innerHTML = "Search Yielded No Results..."
document.getElementsByClassName("page")[0].appendChild(noResults);

// Hide the message.
document.getElementsByClassName("page")[0].getElementsByTagName('h1')[0].style.display = "none";


function showPage(list, page, pageSize) {

    // Set beginning and end indexes.
    var startIndex = page * pageSize - pageSize;
    var endIndex = page * pageSize;

    // itterate though list of stuents and show and hide them
    // based on whether they are between the indexes and
    // are not in the search.
    var i = 0;
    var j = 0;
    while (i < list.length) {

        // if book matches search then check if they are within the indices.
        if (list[i].className != 'book-item invisible') {

            // if book not within the indices then don't display.
            // else display.
            if ((j < startIndex || j >= endIndex)) {
                list[i].style.display = "none";
            } else {
                list[i].style.display = "table-row";
            }
            j += 1;
        } else {

            // if book does not match search don't display.
            list[i].style.display = "none";
        }
        i += 1;
    }
}

function createPagination(page, numberOfPageLinks) {

    var element = document.createElement('div');  // Holds element to be created.

    // Add a class name to the element.
    element.className = "pagination";

    // Create ul element.
    element.innerHTML = "<ul>";

    // create each li and 'a' element inside ul element.
    for (var i = 1; i <= numberOfPageLinks; i += 1) {
        if (i === page) {
            element.innerHTML += "<li><a class=\"active\" href=\"#\">" + i + "</a></li>";
        } else {
            element.innerHTML += "<li><a href=\"#\">" + i + "</a></li>";
        }
    }

    // Close ul element.
    element.innerHTML += "</ul>";

    // Add element to the page.
    document.getElementsByClassName("page")[0].appendChild(element);
}

function getBookListLenght(bookList) {

    // Holds the number of books in the search.
    var result = 0;

    // Itterate over bookList and count the number of books in the search.
    for (var i = 0; i < bookList.length; i += 1) {
        if (bookList[i].className === 'book-item') {
            result += 1;
        }
    }

    // If there are no matches display no search result message.
    if (result === 0) {
        document.getElementsByClassName("page")[0].getElementsByTagName('h1')[0].style.display = "block";
    } else {
        document.getElementsByClassName("page")[0].getElementsByTagName('h1')[0].style.display = "none";
    }

    // retrun the number of books in the search.
    return result;
}

function appendPageLinks(bookList) {

    var page = 1;  // Which page is being displayed.
    var listSize = 4; // the maximum books per page.
    var numberOfPageLinks = Math.ceil(getBookListLenght(bookList) / listSize); // The number of pagination links.

    // Show one page of books.
    showPage(bookList, page, listSize);

    // Create pagination links for that page.
    createPagination(page, numberOfPageLinks);

    // Holds list of li elements in pagination div.
    var element = document.getElementsByClassName('pagination')[0].getElementsByTagName('li');

    // create event listener for each li in pagination.
    for (var i = 0; i < numberOfPageLinks; i += 1) {
        element[i].addEventListener('click', function () {

            // Set the page varible to the paginations link's number value.
            page = parseInt(this.textContent);

            // clear the "active" or selected class from li's in pagination.
            for (var j = 0; j < element.length; j += 1) {
                element[j].getElementsByTagName('a')[0].className = "";
            }

            // Add active class to current page's pagination link.
            this.getElementsByTagName('a')[0].className = "active";

            // Show current page.
            showPage(bookList, page, listSize);

        });
    };
}

// initail pagination call.
appendPageLinks(bookList);

// function curtesy of Prakash Poudel
// https://www.sharmaprakash.com.np/javascript/ie-alternative-to-inludes/
function includes(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
        returnValue = true;
    }
    return returnValue;
}

// Add event listener keyup.
document.getElementById('input').addEventListener('keyup', function () {

    // for every book if book name is not in search then remove
    // or make it "invisible" to showPage.
    for (var i = 0; i < bookList.length; i += 1) {
        if ((!includes(bookList[i].getElementsByTagName('a')[0].innerHTML.toUpperCase(), this.value.toUpperCase())) &&
            (!includes(bookList[i].getElementsByTagName('td')[1].innerHTML.toUpperCase(), this.value.toUpperCase())) &&
            (!includes(bookList[i].getElementsByTagName('td')[2].innerHTML.toUpperCase(), this.value.toUpperCase())) &&
            (!includes(bookList[i].getElementsByTagName('td')[3].innerHTML.toString(), this.value.toUpperCase()))) {
            bookList[i].className = 'book-item invisible';
        } else {
            bookList[i].className = 'book-item';
        }
    }

    // remove pagination and add back new pagination
    // and reset page.
    document.getElementsByClassName('page')[0].removeChild(document.getElementsByClassName('pagination')[0]);
    appendPageLinks(bookList);
});

// Add click event,
document.getElementById('button').addEventListener('click', function () {

    // for every book if book name is not in search then remove
    // or make it "invisible" to showPage.
    for (var i = 0; i < bookList.length; i += 1) {
        if ((!(includes(bookList[i].getElementsByTagName('a')[0].innerHTML.toUpperCase(), document.getElementById('input').value.toUpperCase()))) &&
            (!(includes(bookList[i].getElementsByTagName('td')[1].innerHTML.toUpperCase(), document.getElementById('input').value.toUpperCase()))) &&
            (!(includes(bookList[i].getElementsByTagName('td')[2].innerHTML.toUpperCase(), document.getElementById('input').value.toUpperCase()))) &&
            (!(includes(bookList[i].getElementsByTagName('td')[3].innerHTML.toString(), document.getElementById('input').value.toUpperCase())))) {
            bookList[i].className = 'book-item invisible';
        } else {
            bookList[i].className = 'book-item';
        }
    }

    // remove pagination and add back new pagination
    // and reset page.
    document.getElementsByClassName('page')[0].removeChild(document.getElementsByClassName('pagination')[0]);
    appendPageLinks(bookList);
});
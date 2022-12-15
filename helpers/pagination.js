const baseURI = process.env.BASE_URI

const getLastPageStart = (totalCards, limit) => { return ((Math.ceil(totalCards / limit) * limit) - limit) + 1 }

const getQueryString = (position, totalCards, start, limit) => {
    if (limit == totalCards) {
        return baseURI
    }

    switch (position) {
        case "first":
            startValue = 1
            break
        case "last":
            startValue = getLastPageStart(totalCards, limit)
            break
        case "previous":
            startValue = (start - limit < 1) ? 1 : start - limit
            break
        case "next":
            startValue = (start + limit > totalCards) ? getLastPageStart(totalCards, limit) : start + limit
            break
        default:
            return baseURI
    }
    return baseURI + `?start=${startValue}&limit=${limit}`

}
 
const createPagination = (totalCards, currentCards, start, limit) => {

    const page = Math.ceil(start / limit)
    const totalPages = (Math.ceil(totalCards / limit) == 0) ? 1 : Math.ceil(totalCards / limit)

    return {
        "currentPage": page,
        "currentItems": currentCards,
        "totalPages": totalPages,
        "totalItems": totalCards,
        "_links": {
            "first": {
                "page": 1,
                "href": getQueryString("first", totalCards, start, limit)
            },
            "last": {
                "page": totalPages,
                "href": getQueryString("last", totalCards, start, limit)
            },
            "previous": {
                "page": (page <= 1) ? 1 : page - 1,
                "href": getQueryString("previous", totalCards, start, limit)
            },
            "next": {
                "page": (page >= totalPages) ? totalPages : page + 1,
                "href": getQueryString("next", totalCards, start, limit)
            }
        }

    }
}

module.exports = { createPagination }
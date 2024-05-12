
/**
 * Extracts product information from SERP API results.
 * @param {Object} data - The SERP API response data containing shopping results.
 * @returns {Array} An array of objects representing extracted product information.
 */
function extractShoppingResults(data) {
    try {
        let shoppingResults = data.shopping_results;
        if(shoppingResults.length ==0){
            shoppingResults = data.related_shopping_results
        }
        const result = [];
    
        for (const item of shoppingResults) {
            const product = {
                "title": item.title ?? "",
                "link": item.link ?? "",
                "product_link": item.product_link ?? "",
                "product_id": item.product_id ?? "",
                "source": item.source ?? "",
                "price": item.price ?? "",
                "extracted_price": item.extracted_price ?? "",
                "rating": item.rating ?? "",
                "reviews": item.reviews ?? "",
                "extensions": item.extensions || [],
                "thumbnail": item.thumbnail ?? "",
                "delivery": item.delivery ?? "",
                "store_rating": item.store_rating ?? "",
                "store_reviews": item.store_reviews ?? "",
                "remark": item.remark ?? "" ,
                "clickCount":0,
            };
    
            result.push(product);
        }
    
        return result;
    } catch (error) {
        console.error("error while extracting shopping results");
        return []
    }
}


module.exports = {extractShoppingResults}

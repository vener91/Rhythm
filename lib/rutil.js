/**
 * Returns an array of keys
 * @param object Object of key-value pair
 * @return Array returns array of keys
 */
exports.arrayKeys = function(object){
    var arrayOfKeys = []
    for(key in object){
        arrayOfKeys.push(key);
    }
    return arrayOfKeys;
}
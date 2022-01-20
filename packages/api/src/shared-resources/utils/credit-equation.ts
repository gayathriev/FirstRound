/**
 * @description
 * Developer editable values to adjust
 * the credit equation to optimal values
 * through testing
 */
const maxCredits = 100;
const minCredits = 5
const limitMenuCount = 30;

/**
 * @description
 * Apply an inverse linear relationship with pre-defined
 * max and min value to determine the new credit value for 
 * a venue based on the number of menu items
 * 
 * The maximum value, minimum value, and maximum number
 * of menu items before becoming a constant value
 * determines the gradient of the line
 * 
 * @param menuItemCount: how many menu items there are for a venue
 * @returns a credit value for the venue (how much uploading is worth)
 */
export async function creditEquation (
    menuItemCount: number,
) {
    // don't bother going through any of the logic if we have more than max menu items
    if (menuItemCount >= limitMenuCount) return minCredits
    // likewise if there are no menu items
    if (menuItemCount === 0) return maxCredits

    // give x and y values for readability
    // x1 is always 0 because we can't have negative menu items
    const x1 = 0
    const y1 = maxCredits
    const x2 = limitMenuCount
    const y2 = minCredits

    // work out our gradient from these constants
    // gradient = change in y / change in x
    const gradient = (y2 - y1) / (x2 - x1)
    
    // check we didn't divide by 0
    if (gradient === Infinity) {
        // if we did then x2 must be 0, return max
        return maxCredits
    }

    // our equation is y = gradient * menuItemCount + maxCredits
    // calculate our value on the line
    const newCreditValue = (gradient * menuItemCount) + maxCredits

    // check our credit value is within our max and min credit values
    if (newCreditValue > maxCredits) return maxCredits
    if (newCreditValue < minCredits) return minCredits

    // return the floor of our credit value
    return Math.floor(newCreditValue)
}
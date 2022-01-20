// threshold as a percentage of similarity between two sets of n-grams
const THRESHOLD = 0.6;
// size of the n-grams we generate
const NGRAM_SIZE = 3;

/**
 * @description
 * Generate a collection of 'n' characters from a string
 * to allow for misspellings in search
 * 
 * @param input: the string to generate ngrams from
 * @returns returns a list of ngrams
 */
export const generateNGrams = (input: string): string[] => {
    const term = input.replace(/[^\w\d]/g, '').toLowerCase();
    
    let ngrams: string[] = [];

    for (let i = 0; i <= Math.max(term.length - NGRAM_SIZE, 0); i++) {
        ngrams.push(term.slice(i, Math.min(i + NGRAM_SIZE, term.length)));
    }

    return ngrams;
}

/**
 * @description
 * Take ngrams generated from two strings
 * and return whether there is enough similarity
 * to be considered the same
 * 
 * @notes
 * See page 355 of:
 * Zobel, J. and Dart, P. (1995),
 * Finding approximate matches in large lexicons.
 * Softw: Pract. Exper., 25: 331-345.
 * https://doi.org/10.1002/spe.4380250307
 * 
 * @param sGrams: ngrams from a search term
 * @param tGrams: ngrams from two strings to be compared
 * @returns a boolean indicating whether the nGrams intersection
 *          is high enough to be considered a match
 */
export const searchNGrams = (sGrams: string[], tGrams: string[]): boolean  => {

    const intersectionCardinality = sGrams.filter(x => tGrams.includes(x)).length;

    const totalLength = sGrams.length + tGrams.length;

    return (totalLength - (2 * intersectionCardinality)) <= THRESHOLD * totalLength;
}
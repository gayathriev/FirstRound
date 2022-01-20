// helper function imports
import {
    generateNGrams,
} from '../../shared-resources/utils/fuzzy-searching';


/**
 * Function used for generating the queries we need to carry out a fuzzy
 * search on a set of search terms.
 */
 const SEARCH_THRESHOLD = 0.6;

 /**
  * @description
  * Generates a fuzzy searching query based on
  * the generateNGrams function
  * 
  * @param searchField: the database field to search over
  * @param searchTerm: the term being searched for
  * @returns the fuzzy searching query
  * 
  * @notes
  * This is long and deeply-nested because our tier of MongoDB doesn't
  * allow us to use server-side scripting. If you'd like to see a
  * human-readable version of this please have a look at the
  * searchNGrams function in src/utils/fuzzy_searching.ts
  */
 export const generateFuzzySearchQuery = (searchField: string, searchTerm: string) => {
     const searchTermNGrams = generateNGrams(searchTerm);
     
     return {
         $lte : [
             {
                 $subtract: [
                     {
                         $add : [
                             { $size : searchField },
                             searchTermNGrams.length
                         ]
                     },
                     {
                         $multiply : [
                             2,
                             {
                                 $size : { 
                                     $filter : {
                                         input: searchTermNGrams,
                                         as: "term",
                                         cond: {
                                             $in : ["$$term", searchField]
                                         }
                                     }
                                 }
                             }
                         ]
                     }
                 ]
             },
             {
                 $multiply : [
                     SEARCH_THRESHOLD,
                     {
                         $add : [
                             { $size : searchField },
                             searchTermNGrams.length
                         ]
                     }
                 ]
             }
         ]
     };
 }
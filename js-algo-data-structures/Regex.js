/* Restrict Possible Usernames
 1) Usernames can only use alpha-numeric characters.
 2) The only numbers in the username have to be at the end.
    There can be zero or more of them at the end.
    Username cannot start with the number.
 3) Username letters can be lowercase and uppercase.
 4) Usernames have to be at least two characters long.
    A two-character username can only use alphabet letters as characters.
*/
let userCheck = /^[a-z]([a-z]+|\d\d)\d*$/i;

/* Positive and Negative Lookahead
   Use lookaheads in the pwRegex to match passwords that are
   greater than 5 characters long, do not begin with numbers,
   and have two consecutive digits.
*/
let pwRegex = /(?=\w{5,})(?=^\D\w*\d{2})/;

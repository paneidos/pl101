// Load modules
var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Utility functions
var wrapExceptions = function(f) {
    return function(x) {
        try {
            return f(x);
        }
        catch(err) {
            return undefined;
        }
    };
};

var assert_eq = function(got, expected, whatAreWeDoing)
{
    console.log(whatAreWeDoing);
    assert.deepEqual(got,expected);
}

// Read file contents
var data = fs.readFileSync('scheem.txt', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = wrapExceptions(PEG.buildParser(data).parse);


// Nathan's tests
assert_eq(parse(""), undefined,
    "don't parse empty string");
assert_eq(parse("atom"), "atom",
    "parse atom");
assert_eq(parse("+"), "+",
    "parse +");
assert_eq(parse("(+ x 3)"), ["+", "x", "3"],
    "parse (+ x 3)");
assert_eq(parse("(+ 1 (f x 3 y))"), 
    ["+", "1", ["f", "x", "3", "y"]],
    "parse (+ 1 (f x 3 y))");

// Whitespace feature
assert_eq( parse("(a  b  c)"), ["a", "b", "c"], "parse with extra whitespace: (a  b  c)" );

// Quote feature
assert_eq( parse("'(1 2 3)"), ["quote", ["1","2","3"]], "parse quote syntax: '(1 2 3)");

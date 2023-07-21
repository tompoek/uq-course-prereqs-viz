// Class definition of Node which semantically represents a Course
class Node {
  // In this script, we want to adopt our output object syntax to S3 viz tool,
  // which defines "name" as a property to display, although it semantically means a course code,
  // to be consistent in the whole script, we will stick to this syntax ("name") instead of aligning with semantics ("code").
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }
}


// Recursive function to get the children of a node and its descendants
// Traversing in Depth-First-Search manner
function getDescendants(node) {

  const result = {name: node.name, children: []};

  children_names = getChildrenNames(node);

  for (child_name of children_names) {
    const childNode = new Node(child_name);
    const childDescendants = getDescendants(childNode);
    result.children.push(childDescendants);
  }

  return result;
}


// Function that extracts names of children of a given node (course)
// by searching in the contents of a text file
function getChildrenNames(node) {
  children_names = [];

  keyword = node.name + ',prerequisite,';  // Define our keyword to search for
  if (txt_contents.search(keyword)!=-1) {
    line_start = txt_contents.slice(txt_contents.search(keyword));  // Find the start of line with keyword
    line = line_start.slice(keyword.length, line_start.search(/\r?\n/));  // Slice the line that contains children names
    if (line.slice(-1)==".") {line = line.slice(0,-1)};  // Remove full stop if any

    // >> TOFIX: interpret parentheses
    while(line.search(/\(/)!=-1) {line = line.replace("(", "")};
    while(line.search(/\)/)!=-1) {line = line.replace(")", "")};
    // << TOFIX: for now, we naively remove all parentheses

    // >> TOFIX: interpret "AND" relationship
    while(line.search(" and ")!=-1) {line = line.replace(" and ", ",")};
    // << TOFIX: for now, we naively remove all "AND"

    // >> TOFIX: interpret "OR" relationship
    while(line.search(" or ")!=-1) {line = line.replace(" or ", ",")};
    // << TOFIX: for now, we naively remove all "OR"

    line.split(",").forEach((str) => {
      if(isCourseName(str)) {children_names.push(str)}
    });

  }

  return children_names;
};


// Function that verifies if an eight-chars string is a course name.
// Criteria: First three chars are upper-case-letters; Fourth char is either upper-case-letter or digit; Last four chars are digits.
function isCourseName(str) {
  if(str.length==8) {
    if(str[0]==str[0].toUpperCase() && str[1]==str[1].toUpperCase() && str[2]==str[2].toUpperCase() && 
      (str[3]==str[3].toUpperCase() || !isNaN(str[3]*1)) && 
      !isNaN(str[4]*1) && !isNaN(str[5]*1) && !isNaN(str[6]*1) && !isNaN(str[7]*1)) {
      return true
    }
    else {
      return false
    }
  }
  else {
    return false
  }
}







// DEFINE GLOBAL VARIABLES
// Read data file
// TOFIX: Error due to require("fs") library only supported by node.js but not html
// TESTING: Hard code data
const txt_contents = "COMP3506,prerequisite,CSSE2002 and (MATH1061 or (CSSE2010 and STAT2202))\nCSSE2002,prerequisite,CSSE1001 or ENGG1001\nMATH1061,prerequisite,\nCSSE2010,prerequisite,CSSE1001 or ENGG1001\nCSSE1001,prerequisite,\n";
// const txt_file = "output.txt";
// const reader = require("fs");
// const txt_contents = reader.readFileSync(txt_file, "utf-8");


// MAIN FUNCTION
function mainFunction() {


  // // Input: root node
  const root_name = document.getElementById("search").value;
  const root = new Node(root_name);

  // Output: descendants
  // TOFIX: Error after switching from node.js to html
  const output = getDescendants(root);

  // Convert output to json format
  output_to_json = JSON.stringify(output);

  // Write json-formatted output into json file
  // TOFIX: Error due to require("fs") library only supported by node.js but not html
  // TESTING: Show output json object in html
  const output_html = document.getElementById("output");
  output_html.innerHTML = output_to_json;
  // var writer = require("fs");
  // writer.writeFile("output.json", output_to_json, function(err) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     else {
  //       console.log("Output to JSON is successful! Congrats!!")
  //     }
  // });


}


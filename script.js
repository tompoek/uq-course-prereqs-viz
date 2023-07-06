class Node {
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

  children_names = get_children_names(node);

  for (child_name of children_names) {
    const childNode = new Node(child_name);
    const childDescendants = getDescendants(childNode);
    result.children.push(childDescendants);
  }

  return result;
}


function get_children_names(node) {
  children = [];

  keyword = node.name + ',prerequisite,';
  if (txt_contents.search(keyword)!=-1) {
    line_start = txt_contents.slice(txt_contents.search(keyword)+keyword.length);
    line = line_start.slice(0, line_start.search(/\r?\n/));
    line = remove_full_stop(line);

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

    line.split(",").forEach((leaf) => {
      if(is_course_code(leaf)) {children.push(leaf)}
    });

  }

  return children;
};


function is_course_code(code) {
  if(code.length==8) {
    if(code[0]==code[0].toUpperCase() && code[1]==code[1].toUpperCase() && code[2]==code[2].toUpperCase() && 
      (code[3]==code[3].toUpperCase() || !isNaN(code[3]*1)) && 
      !isNaN(code[4]*1) && !isNaN(code[5]*1) && !isNaN(code[6]*1) && !isNaN(code[7]*1)) {
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


function remove_full_stop(str) {if(str.slice(-1)==".") {return str.slice(0,-1)} else {return str}};






// >> MAIN FUNCTION

// Read data file
const txt_file = "output.txt";
const reader = require("fs");
const txt_contents = reader.readFileSync(txt_file, "utf-8");


// Input: root node
const root_course = new Node('COMP3506');  // TODO: make it a commander argument

// Output: descendants
const output = getDescendants(root_course)

output_to_json = JSON.stringify(output);

var writer = require("fs");
writer.writeFile("output.json", output_to_json, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Output to JSON is successful! Congrats!!")
    }
});

// << MAIN FUNCTION


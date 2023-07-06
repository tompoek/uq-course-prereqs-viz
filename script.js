class Node {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }
}


function getDescendants(node) {

  const result = {name: node.name, children: []};

  for (const childNode of node.children) {
    const childDescendants = getDescendants(childNode);
    result.children.push(childDescendants);
  }

  return result;
}


// >> TODO: make it a recursive loop,
// >> consider BFS first
function search_children(course) {
  output = {name: course, children: []};
  keyword = course+",prerequisite,";
  if(txt_contents.search(keyword)!=-1) {
    lines = txt_contents.slice(txt_contents.search(keyword)+keyword.length);
    line = lines.slice(0, lines.search(/\r?\n/));
    children = get_children(line);
    children.forEach((child) => {
      output.children.push({name: child, children: []});
      // >> Experiment recursive loop... this would be DFS
      // output.children.push(search_children(child));
      // << Experiment recursive loop.
    })
  }
  return output;
}
// << TODO


function get_children(line) {
  children = [];

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

// const txt_file = "output.txt";
// root_course = "MATH2001";  // TODO: make the course code a command line argument
const root_course = new Node('MATH2001');  // TODO: make the course code a cmd argument
const child1 = new Node('B');
const child2 = new Node('C');
const grandchild1 = new Node('D');
const grandchild2 = new Node('E');

root_course.addChild(child1);
root_course.addChild(child2);
child2.addChild(grandchild1);
child2.addChild(grandchild2);

// const reader = require("fs");
// const txt_contents = reader.readFileSync(txt_file, "utf-8");

// output = search_children(root_course);
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


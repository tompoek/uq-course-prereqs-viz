
const txt_file = "output.txt";
course = "MATH2001";
output = {name: course, children: []}

const reader = require("fs");
const txt_contents = reader.readFileSync(txt_file, "utf-8");

keyword = course+",prerequisite,";
// >> TODO: make it a recursive loop,
// >> consider BFS first
if(txt_contents.search(keyword)!=-1) {
  lines = txt_contents.slice(txt_contents.search(keyword)+keyword.length);
  line = lines.slice(0, lines.search(/\r?\n/));
  children = get_children(line);
  children.forEach((child) => {
    output.children.push({name: child});
  })
}
// << TODO

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

  line.split(",").forEach((leaf) => {children.push(leaf)});

  return children;
};


function remove_full_stop(str) {if(str.slice(-1)==".") {return str.slice(0,-1)} else {return str}};


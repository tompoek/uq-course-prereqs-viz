"""
Given a list of UQ course codes, crawl the UQ course website and scrape
information pertaining to said course.
"""

import sys
import requests
from bs4 import BeautifulSoup

# Headers for making web requests look like a real user (or they may be
# rejected by the UQ website)
headers = requests.utils.default_headers()
headers.update(
    {
        'User-Agent': 'PreReqBot 1.0',
    }
)

# The base URL we want to make requests to
BASE = 'https://my.uq.edu.au/programs-courses/course.html?course_code='

# The internal HTML id's of the blocks of interest
INCOMPAT = "course-incompatible"
PREREQ = "course-prerequisite"

# Converts the resulting HTML to string, and converts commas to "and"
def format_courses(results):
  outstring = " " .join(x.text.strip() for x in results)
  outstring = outstring.replace(",", " and ")
  return outstring.replace("  ", " ") # Remove double spaces

# Run it
def main():

  if len(sys.argv) != 2:
    print ("Usage: python3 crawl.py [file-of-courses]")
    print ()
    print ("[file-of-courses] is a one-course-per-line text file.")
    sys.exit(1)

  # Open the input file
  with open(sys.argv[1]) as f:
    # For each line in the file
    for line in f:
      # Grab the course code
      code = line.strip()
      # Build the URL target
      url = BASE + code
      # Download the page and get the content
      html = requests.get(url, headers=headers).content
      # Parse the HTML 
      parsed_doc = BeautifulSoup(html, "html.parser")
      # Extract the elements of interest
      incompat = parsed_doc.findAll('p', {'id': INCOMPAT})
      prereq = parsed_doc.findAll('p', {'id': PREREQ})
      # Print them out
      print(code + ",incompatible," + format_courses(incompat))
      print(code + ",prerequisite," + format_courses(prereq))


if __name__ == "__main__":
  main()

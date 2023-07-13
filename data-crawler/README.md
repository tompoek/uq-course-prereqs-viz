- Expects Python3+
- Check imports inside crawl.py for dependencies
  - sys, requests, bs4 

Usage:
```
python3 crawl.py courses.txt

COMP2048,incompatible,
COMP2048,prerequisite,MATH1061 and (CSSE1001 or ENGG1001)
COMP3506,incompatible,COMP2502 or COMP7505
COMP3506,prerequisite,CSSE2002 and (MATH1061 or (CSSE2010 and STAT2202))
CSSE1001,incompatible,COMP1502 and CSSE7030 and ENGG1001
CSSE1001,prerequisite,
CSSE2002,incompatible,COMP2500 or COMP7908 or CSSE7023
...
```

Output is always a 3-field CSV: <target course code>,<incompatible | prerequisite>,<string extracted from the UQ courses site>


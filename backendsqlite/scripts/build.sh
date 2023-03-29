#!/bin/bash

rm -r -f build


mkdir -p build/

cd src/frontend/
pwd
for f in  *.{js,html,css} ; do 
     echo "$f";
     npx minify "$f" > "../../build/$f" ;
done



#!/bin/bash

val=5

# On supprime tous les rapport js pouvant être présent

    rm  -f lintjs*.out

    # touch lintjs.out


# Pour chaque fichier js on check
for file in src/controllers/*.js src/frontend/*.js src/routes/*.js src/models/*js ; do 
    npx eslint "$file" >> "lintjs-report.out"
done 

# # S'il y a eu une erreur on renvoie 1 en sortie
# for i in lintjs_*.out; do
#     if grep -q "[1-9]* error_ " "$i"; then  
#         val=10
#         echo "Error in file $i " >> lintjs.out
#         break
#     fi
# done

# # S'il n'y a pas eu d'erreur on renvoie 0 en sortie
# if [ "$val" -eq 5 ]; then 
#     echo 0
# else 
#     echo 1
# fi

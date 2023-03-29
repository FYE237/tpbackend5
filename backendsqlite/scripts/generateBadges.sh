#!/bin/bash



#Badge JS
#Génération du bash pour la partie eslint
NBERR=$(grep -e "^ERROR" lintjs-report.out | wc -l)
NBWARN=$(grep -e "^WARNING" lintjs-report.out | wc -l)
color="green"
if [[ $NBERR -gt 0 ]]
then 
  color="red"
  else if [[ $NBWARN > 0 ]]
  then 
    color="orange"
  fi
fi
anybadge -o -l "LINT" -v "$NBERR $NBWARN" -c "$color" -f "badge_eslint.svg"



#Génération du bash pour la partie Cypress
color="green"
NBERR=$(grep -e "^failing" cypresstest_report.out | wc -l)
if [[ $NBERR > 0 ]]
then
  color="red"
fi
anybadge -o -l "CYPRESS" -v "$NBERR" -c "$color" -f "badge_cypress.svg"




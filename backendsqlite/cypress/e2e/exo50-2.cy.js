// //On reinitialise les élements
// describe('Reinitialize datas' ,() => {
//     it('Reinitialize datas',() => {
//     const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZmV6ZXV5b2UiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.WukY_Yico958FuJ_7PPymgzmNnjWtbNyv_iYIbxoWhA" //replace by your token : go to BACKEND/getjwsDeleg/caw to obtain it
//     cy.request({
//         method: 'POST',
//         url: 'https://cawrest.osc-fr1.scalingo.io/bmt/fezeuyoe/reinit',
//         headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},


//         body: {
//         }
//     }).then((response) => {
//         //Si le POST a marché on doit avoir cette réponse
//         expect("Bookmarks and Tags initialized").to.equal(response.body.msg)
//     });
//     })
// })

describe('My First Test', () => {
    it('Visits Exercice 50', () => {
      cy.visit('http://localhost:3000/frontend/Exercice-50.html')

      //On vérifie si le nombre d'élements de départ est 4
      cy.get("#items").children().should("have.length",4)
    })
  })


//On ajoute un nouvel élement
describe('Add element', () => {
    it('Add element', () => {
      cy.visit('http://localhost:3000/frontend/Exercice-50.html')

      //On vérifie si la zone de text est nulle
      cy.get("[name='name']").should("have.value","")

      //On écrit le nom du Tag 
      cy.get("[name='name']").type("FLI")

      //On clique sur le bouton
      cy.get("#addTag").click()
    })

   
  })


describe("Verify Ajout",()=>{
   //On vérifie que le nombre d'élements a augmenté de 1
   it('Verify element', () => {
    cy.visit('http://localhost:3000/frontend/Exercice-50.html')
    
    //On vérifie si le nombre d'élements de départ est 5
  cy.get("#items").children().should("have.length",5)
    
  })
})

//On supprime un nouvel élement
describe('Delete element', () => {
  //On vérifie que le nombre d'élements a augmenté de 1
  it('delete element', () => {
      cy.visit('http://localhost:3000/frontend/Exercice-50.html')
      
    cy.get("#items").children().first().click()

    cy.get("[value='Remove Tag']").click()
    })
})


describe('Verify delete',() => {
   //On vérifie la modification
   it('Verify Modif', () => {
    cy.visit('http://localhost:3000/frontend/Exercice-50.html')
    cy.get("#items").children().should("have.length",4)      

  })
})




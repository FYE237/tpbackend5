/* Base URL of the web-service for the current user and access token */
const backend =   "http://localhost:3000/" //"https://cawrest.osc-fr1.scalingo.io/" //"https://cawrest.ensimag.fr" // replace by the backend to use
					
//const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZmV6ZXV5b2UiLCJkZWxlZyI6Im5vdC1kZWZpbmVkIn0.WukY_Yico958FuJ_7PPymgzmNnjWtbNyv_iYIbxoWhA" //replace by your token : go to BACKEND/getjwsDeleg/caw to obtain it

const token	 ="eyJhbGciOiJIUzI1NiJ9.ZmV6ZXV5b2U.9FOe8MoLypU8ECNdYBEqERNR79csqG0_2U01Gq2h8_g"
const wsBase = `${backend}/bmt/fezeuyoe/` // replace USER by your login used to obtain TOKEN

/* Shows the identity of the current user */
function setIdentity() {
	//TODO 1
	//On fait un get pour récupérer l'identité
	fetch(backend+"whoami", {
		method: 'GET' ,
		headers: {"x-access-token": token}
	})
	.then(res=>res.json())
	.then(res=>{
		console.log(res)
		console.log(res.data)
		document.querySelector("span").innerText = res.data 
	})

}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight
	availableHeight -= document.getElementById("contents").offsetTop
	availableHeight -= 2 * document.querySelector('h1').offsetTop
	availableHeight -= 4 * 1
	document.getElementById("contents").style.height = availableHeight + "px"
}


/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	// TODO
	 parent = document.querySelector('ul[id="menu"]')
	 const init = parent.querySelector('li[class="tags"]')
	 const children = parent.querySelectorAll('li')
	 let tmp = "";

	 //ON identifie quel est le type courant
	 children.forEach(element => {
		if(element.classList.contains("selected")){
			tmp = element.className
		}
	 }); 
	 if(tmp.includes("tags")) tmp = "tags"
	 else if(tmp.includes("bookmarks")) tmp = "bookmarks"

	//Initialisation et si le type courant a changé
	if((init != null && type === "tags") || (tmp != type  )) {
		if(type === "tags" ) {
			if(document.querySelector("#addBookMark"))  document.querySelector("#addBookMark").remove()

			if(parent.querySelector('li[class="bookmarks selected"]') != null)
				{
					parent.querySelector('li[class="bookmarks selected"]').classList.remove("selected")
				}
			parent.querySelector('li[class="tags"]').classList.add("selected")
			listTags();
			document.querySelector('div[class="tag" ]').classList.add("selected")		
		}

		if(type === "bookmarks"){
			if(document.querySelector("#addBookMark"))  document.querySelector("#addBookMark").remove()
			if(parent.querySelector('li[class="tags selected"]') != null)
				{
					parent.querySelector('li[class="tags selected"]').classList.remove("selected")
				}
			parent.querySelector('li[class="bookmarks"]').classList.add("selected")
			listBookmarks();
			parent2 = document.getElementById("add");
			parent2.querySelector('div[class="tag selected"]').classList.remove("selected")
		}
	}
	//Si c'est la même chose on ne fait rien
	else console.log("Aucun select")
}

function createBookmarkForm(){

	if(document.querySelector("#addBookMark"))  document.querySelector("#addBookMark").remove()


	formBookMark = document.createElement("form")
	formBookMark.setAttribute("id","addBookMark")

	ul = document.createElement("ul")
	ul.style.listStyle = "none"

	//Titre
	li_title = document.createElement("li")
	title = document.createElement("label")
	title.innerText = "Title"
	li_title.appendChild(title)
	title_input = document.createElement("input")
	title_input.setAttribute("type","text")
	title_input.setAttribute("id" , "title")
	title_input.setAttribute("name" , "Title")
	li_title.appendChild(title_input)

	ul.appendChild(li_title)

	//Description
	li_description = document.createElement("li")
	description = document.createElement("label")
	description.innerText = "description"
	li_description.appendChild(description)
	description_textarea = document.createElement("textarea")
	description_textarea.setAttribute("id","description")
	description_textarea.setAttribute("name" , "description")
	li_description.appendChild(description_textarea)

	ul.appendChild(li_description)

	//Link
	li_link = document.createElement("li")
	link = document.createElement("label")
	link.innerText = "link"
	li_link.appendChild(link)
	link_input = document.createElement("input")
	link_input.setAttribute("type","text")
	link_input.setAttribute("name" , "link")
	link_input.setAttribute("id" , "link")
	li_link.appendChild(link_input)

	ul.appendChild(li_link)

	//On ajoute l'ensemble au formulaire
	formBookMark.appendChild(ul)

	//Bouton d'input
	add_button = document.createElement("input")
	add_button.setAttribute("type","submit")
	add_button.setAttribute("id","addBookmarks")
	add_button.setAttribute("value","Add Bookmark")
	add_button.addEventListener("click",addBookmark,false)
	formBookMark.appendChild(add_button)

	
	
	//Un peu de CSS
	// formBookMark.style.display = "flex"
	// formBookMark.style.flexDirection= "row"
	// ul.style.display="flex"
	// ul.style.flexDirection="column"
	ul.style.gap="10px"


	document.querySelector("#items").after(formBookMark)

}

//Fontion asynchrone qui ajoute le tag
// async function ajoutBookmark(valeur){
// 	//Ajout du TAG
// 	const element=new URLSearchParams()
// 	element.append("data", valeur)
// 	await fetch(backend+"bmt/fezeuyoe/bookmarks",
// 			{  method:'POST', 
// 			headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
// 			body : element
// 			})
// }	


function addBookmark(event){
	//On vérifie que tous les champs obligatoires ont été ajouté
	event.preventDefault();

	//Ensuite on  ajoute le bookmark crée
	console.log("Bookmark Ajouté")
	title = document.getElementById("title")
	description = document.getElementById("description")
	link = document.getElementById("link")

	//On fabrique l'objet bookmark
	objet = {
		'title': title.value,
		'description': description.value,
		'link': link.value,
		'tags': []
	}
	
	// ajoutBookmark(JSON.stringify(objet))

	const element=new URLSearchParams()
	element.append("data", JSON.stringify(objet))
	fetch(backend+"bmt/fezeuyoe/bookmarks",
			{  method:'POST', 
			headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
			body : element
			})

	.then(() => {title.value = "",
	description.value="",
	link.value=""})
	.then(() => listBookmarks())
	.then(console.log("Bookmark add"))
	
	

}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	//TODO
	//On supprime tous les fils : 
	const parent = document.getElementById("items")
	parent.replaceChildren()
	// while(parent.firstChild){
	// 	parent.removeChild(parent.firstChild)
	// }

	//ON crée le formulaire pour l'ajout d'un nouveau tag
	createBookmarkForm()

	//On récupere la liste des tags
	fetch(backend+"bmt/fezeuyoe/bookmarks", {
		method: 'GET' ,
		headers: {"x-access-token": token}
	})
	.then(res => res.json())
	.then(res => {
		res.data.forEach(element=>{
			//On duplique <div class="model bookmark">
			const tmp = document.querySelector('div[class="model bookmark"]')
			child  = tmp.cloneNode(true);

			// console.log(element)

			//On insere les propriéte du bookmark  dans le DOM
			child.setAttribute("num",element.id)
			child.querySelector("h2").innerText=element.title
			child.querySelector("a").setAttribute("href",element.link)
			child.querySelector("a").innerText = element.link
			child.querySelector("div[class='description']").innerText=element.description
			
			element.tags.forEach(elt=>{
				tag_child = document.createElement("li")
				tag_child.innerText=elt.name
				child.querySelector("ul").appendChild(tag_child)
			})

			child.classList.replace("model","item")
			parent.appendChild(child)
		})
	})
}




/* Loads the list of all tags and displays them */
function listTags() {
	//TODO
	//On supprime tous les fils : 
	const parent = document.getElementById("items")
	parent.replaceChildren()
	// while(parent.firstChild){
	// 	parent.removeChild(parent.firstChild)
	// }
	console.log("listTags")

	//On récupere la liste des tags
	fetch(backend+"bmt/fezeuyoe/tags", {
		method: 'GET' ,
		headers: {"x-access-token": token}
	})
	.then(res=>res.json())
	.then(res=>{
		 res.data.forEach(element => {
			// console.log(element)
			//On duplique <div class="model tag">
			const tmp = document.querySelector('div[class="model tag"]')
			child  = tmp.cloneNode(true);

			//On crée le tag dans le DOM
			child.querySelector("h2").innerText=element.name
			child.setAttribute("num" , element.id)
			child.classList.replace("model","item")
			parent.appendChild(child)
		 });
	})
	.catch((res) => console.log(res))
}

//Fontion asynchrone qui ajoute le tag
// async function ajout(valeur){
// 	//Ajout du TAG
// 	const element=new URLSearchParams()
// 	element.append("data", '{"name": "'+valeur+'"}')
// 	await fetch(backend+"bmt/fezeuyoe/tags",
// 			{  method:'POST', 
// 			headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
// 			body : element
// 			})
// }

/* Adds a new tag */
function addTag() {
	//TODO
	valeur = document.querySelector('input[name="name"]').value
	if(valeur === ""){
		alert("Error. La zone de texte est vide")
	}
	else {
		//On appelle la fonction asynchrone qui doit ajouter le tag
		// const tmp = await ajout(valeur)

		const element=new URLSearchParams()
		element.append("data", '{"name": "'+valeur+'"}')
	 	fetch(backend+"bmt/fezeuyoe/tags",
			{  method:'POST', 
			headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
			body : element
			})

		
		.then((res) => { console.log(res.status) 
			console.log("Tag add")
			// console.log(token)
		})
		.catch((res) => {
			console.log(res)
		})
		.then(() => listTags())
		.then(document.querySelector('input[name="name"]').value="")			
	}

}

/* Handles the click on a tag */
function clickTag(tag) {
	//TODO
	if(!tag.classList.contains("selected")){
		const parent = document.querySelector("#items")

		//On parcout pour trouver le fils selectionné
		parent.childNodes.forEach(element => {
			if(element.classList.contains("selected")){
				//On annule les modifs
				element.removeChild(element.querySelector("form"))
				element.classList.remove("selected")
				element.querySelector("h2").style.display="block"
			}
		});

		//On éffectue les modifications
		tag.classList.add("selected")
		tag.querySelector("h2").style.display="none"

		const form1 = document.createElement("form")

		const field = document.createElement("input")
		field.setAttribute("type" , "text")
		field.classList.add("modif")
		form1.appendChild(field)

		const b1 = document.createElement("input")
		b1.setAttribute("type","button")
		b1.setAttribute("value","Modify name")
		b1.addEventListener("click",modifyTag,false)
		form1.appendChild(b1)

		const b2 = document.createElement("input")
		b2.setAttribute("type","button")
		b2.setAttribute("value","Remove Tag")
		b2.addEventListener("click",removeTag,false)
		form1.appendChild(b2)

		tag.appendChild(form1)
	}

}


//Fonction Asynchrone utile pour la modification
// async function modify(valeur,elt){
// 	const element=new URLSearchParams()
// 	element.append("data", '{"name": "'+valeur+'"}')
// 	await fetch(backend+"bmt/fezeuyoe/tags/"+elt,
// 						{  method:'PUT', 
// 						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
// 						   body : element
// 						})
// }

/* Performs the modification of a tag */
 function modifyTag() {
	//TODO 8
	const parent = document.querySelector("#items")
	 let elt
	parent.childNodes.forEach(element => {
		if(element.classList.contains("selected")){
			//On annule les modifs
			elt = element.attributes.num.value
		}
	});

	valeur = document.querySelector(".modif").value

	// const tmp = modify(valeur,elt)

	const element=new URLSearchParams()
	element.append("data", '{"name": "'+valeur+'"}')
	fetch(backend+"bmt/fezeuyoe/tags/"+elt,
						{  method:'PUT', 
						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
						   body : element
						})
	 
	.then((res) =>{
		console.log("Tag modified")
		console.log(res)
	})
	.catch((res) => console.log(res.status) )
	.then(() => listTags())

	
}


//Fonction asynchrone utile pour la suppréssion
// async function supprimer(elt){
// 	await fetch(backend+"bmt/fezeuyoe/tags/"+elt,
// 						{  method:'DELETE', 
// 						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
// 						})
// }

/* Removes a tag */
function removeTag() {
	//TODO 9
	const parent = document.querySelector("#items")
	 let elt
	parent.childNodes.forEach(element => {
		if(element.classList.contains("selected")){
			//On annule les modifs
			elt = element.attributes.num.value
		}
	});

	// const tmp = supprimer(elt)

	fetch(backend+"bmt/fezeuyoe/tags/"+elt,
						{  method:'DELETE', 
						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
						})

	.then(listTags())
	.then(console.log("Tag remove"))

}

//On clique sur un marque page
function clickBookmark(bookmark){
	if(!bookmark.classList.contains("selected")){
		const parent = document.querySelector("#items")

		//On parcout pour trouver le fils selectionné
		parent.childNodes.forEach(element => {
			if(element.classList.contains("selected")){
				//On annule les modifs
				element.removeChild(element.querySelector("form"))
				element.classList.remove("selected")
				element.querySelector(".tags").style.display="block"
			}
		});

		//On éffectue les modifications
		bookmark.classList.add("selected")
		bookmark.querySelector(".tags").style.display="none"

		const form1 = document.createElement("form")

		const field = document.createElement("input")
		field.setAttribute("type" , "text")
		field.classList.add("modif")
		form1.appendChild(field)

		const b1 = document.createElement("input")
		b1.setAttribute("type","button")
		b1.setAttribute("value","Modify name")
		b1.addEventListener("click",modifybookmark,false)
		form1.appendChild(b1)

		const b2 = document.createElement("input")
		b2.setAttribute("type","button")
		b2.setAttribute("value","Remove bookmark")
		b2.addEventListener("click",removebookmark,false)
		form1.appendChild(b2)

		bookmark.appendChild(form1)
	}
}

//Fonction asynchrone utile pour la suppréssion
// async function supprimerBookmark(elt){
// 	await fetch(backend+"bmt/fezeuyoe/bookmarks/"+elt,
// 						{  method:'DELETE', 
// 						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
// 						})
// }

function removebookmark(){
	const parent = document.querySelector("#items")
	 let elt
	parent.childNodes.forEach(element => {
		if(element.classList.contains("selected")){
			//On annule les modifs
			elt = element.attributes.num.value
		}
	});

	// const tmp = supprimerBookmark(elt)

	fetch(backend+"bmt/fezeuyoe/bookmarks/"+elt,
						{  method:'DELETE', 
						   headers: {"x-access-token": token,"content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
						})	
	.then(() => listBookmarks())
	.then(console.log("Recharge"))
}

function modifybookmark(){

}


/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity()
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight()
	window.addEventListener("resize",setContentHeight)
	// Listen to the clicks on menu items
	for (let element of document.querySelectorAll('#menu li')){
		element.addEventListener('click',function() {
			const isTags = this.classList.contains('tags')
			selectObjectType(isTags ? "tags" : "bookmarks")
		},false)
	}
	// Initialize the object type to "tags"
	selectObjectType("tags")
	// Listen to clicks on the "add tag" button

	document.getElementById("addTag").addEventListener("click",addTag,false)
	document.getElementById("items").addEventListener("click",(e)=>{
			// Listen to clicks on the tag items
			const tag = e.target.closest(".tag.item")
			if (tag !== null) {clickTag(tag);return}
			// Questions 10 & 12 - Listen to clicks on bookmark items
			const bookmark = e.target.closest(".bookmark.item")
			if (bookmark !== null) {clickBookmark(bookmark)}
		}
		,false)
}
window.addEventListener('load',miseEnPlace,false)

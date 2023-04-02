/* Base URL of the web-service for the current user and access token */
// const user = 'augera';
const backend = 'http://localhost:3000';
const token = "eyJhbGciOiJIUzI1NiJ9.ZmV6ZXV5b2U.9FOe8MoLypU8ECNdYBEqERNR79csqG0_2U01Gq2h8_g"
const wsBase = `${backend}/bmt/fezeuyoe/`; // replace USER by your login used to obtain TOKEN


/* Shows the identity of the current user */
function setIdentity() {
	fetch(`${backend}/whoami`, {
		method: 'GET' ,
		headers: {"x-access-token": token}
	})
	.then(res=>res.json())
	.then(res=>{
		// console.log(res)
		// console.log(res.data)
		document.querySelector("span").innerText = res.data 
	})

	const identity  = "fezeuyoe";
	document.querySelector('span[class="identity"]')// Récupère le span identity
		.appendChild(document.createTextNode(identity)); //Et ajoute l'id
}

/* Sets the height of <div id="#contents"> to benefit from all the remaining place on the page */
function setContentHeight() {
	let availableHeight = window.innerHeight;
	availableHeight -= document.getElementById('contents').offsetTop;
	availableHeight -= 2 * document.querySelector('h1').offsetTop;
	availableHeight -= 4 * 1;
	document.getElementById('contents').style.height = availableHeight + 'px';
}

const replaceName = {'tags':0, 'bookmarks':1};

/* Selects a new object type : either "bookmarks" or "tags" */
function selectObjectType(type) {
	if(! (type === 'bookmarks' || type === 'tags')) alert('error de type');
	const baliseMenu = document.getElementById('menu');
	const typeBalise = baliseMenu.querySelector('.' + type);

	if(!typeBalise.classList.contains('selected')){//si il ne le trouve pas alors il n'est pas selected
		const previousSelected = baliseMenu.children.item(replaceName[type]);//Récupère l'élément selected (ou non)
		previousSelected.className = previousSelected.classList[0];//Et garde uniquement sa première classe

		typeBalise.classList.add('selected');

		const divAdd = document.getElementById('add');
		const divClassTags = divAdd.querySelector('.tags');
		const divClassBookmarks = divAdd.querySelector('.bookmarks');//Sert pour la partie bonus
		if(type === 'bookmarks'){
			//Appel de listBookmarks
			listBookmarks();
			//Mise à jour des class names
			divClassTags.className = 'tags';
			divClassBookmarks.classList.add('selected');
			//Affichage des add tools
			divClassTags.style.display = 'none';//Utile pour la partie bonus
			divClassBookmarks.style.display = '';

			//La partie ci-dessous sert à ajouter la liste de tags pour la création d'un bookmark
			//On nettoie la selection multiple...
			document.getElementById('tagsSelection').innerHTML = '';

			//... puis on récupère tous les tags
			fetch(`${wsBase}tags`, {method:'GET', headers: {'x-access-token': token}})//Envoie la requete
				.then(res => res.json())//Parse le resultat en objet json
				.then(jsonObject => jsonObject['data'].forEach(e => addSelectableTag(e, 'tagsSelection')));//Ajoute le tag dans ceux sélectionnable pour la création d'un bookmark
		}
		else{
			//Affichage des tags
			listTags();
			//Class names
			divClassTags.classList.add('selected');
			divClassBookmarks.className = 'bookmarks';

			//Affichage des add tools
			divClassTags.style.display = '';//Utile pour la partie bonus
			divClassBookmarks.style.display = 'none';
		}
	}
}


function addSelectableTag(tag, selectionId){
	//On récupère la sélection multiple
	const multipleSelectList =  document.getElementById(selectionId);

	//Crée la nouvelle balise
	const tagOptionBalise = document.createElement('option');
	tagOptionBalise.setAttribute('num', tag['id']);
	tagOptionBalise.textContent = tag['name'];

	//L'ajoute dans la sélection multiple
	multipleSelectList.appendChild(tagOptionBalise);

	return tagOptionBalise;
}

/* Loads the list of all bookmarks and displays them */
function listBookmarks() {
	console.log('listBookmarks called');
	listElem('bookmarks', writeBookmarks);
}

function writeBookmarks(bookmarksJson){
	//Clone le modèle
	const copieModel = document.querySelector('.model.bookmark').cloneNode(deep=true);//deep=true, permet de copier les éléments fils

	//Modifie le modèle en conséquence:
	// - Ajout du titre et du lien
	copieModel.querySelector('h2').textContent = bookmarksJson['title'];
	const aBaliseModel = copieModel.querySelector('a');
	aBaliseModel.setAttribute('href', bookmarksJson['link']);
	aBaliseModel.textContent = bookmarksJson['link'];

	// - Ajout de la description
	copieModel.querySelector('.description').textContent = bookmarksJson['description'];

	// - Ajout des tags
	const tagsList = copieModel.querySelector('.tags');
	bookmarksJson['tags'].forEach((e)=>{
		createLiBalise(tagsList, [document.createTextNode(e['name'])]);
	});

	//Modifie le num et la classe
	copieModel.setAttribute('num',bookmarksJson['id']);
	copieModel.classList.replace('model', 'item');

	//L'inscris dans le fichier
	document.getElementById('items').appendChild(copieModel);
}


/* Removes a bookmark */
function removeBookmark() {
	removeElem('bookmarks', listBookmarks);
}


function addBookmark() {
	//Commence par vérifier que les données saisies sont correctes
	if(! verifInputBookmark('bookmarkTitle', 'bookmarkLink')){
		alert('Veuillez vérifier que vous ayez bien saisi un titre et un lien internet valide!');
		return ;
	}

	//Récupère la liste de tags sélectionnés
	 listTags = [];
	document.getElementById('tagsSelection').childNodes.forEach(e=>{
		if(e.selected){
			listTags.push({"id":e.getAttribute('num'),"name":e.textContent});
		}
	});

	//Crée l'objet JSON correspondant au nouveau bookmark
	 descriptionValue = document.getElementById('bookmarkDescription').value;
	const newBookmark = {
		'title': document.getElementById('bookmarkTitle').value,
		'description': (descriptionValue)? descriptionValue: 'pas de description',
		'link': document.getElementById('bookmarkLink').value,
		'tags': listTags
	};

	//Api : pour envoyer l'élément au back.
	fetch(`${wsBase}bookmarks`, {method:'POST',
		headers:{'x-access-token': token, 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
		body:'data=' + JSON.stringify(newBookmark)})//Envoie la requete
		.then(()=>{
			document.getElementById('bookmarkTitle').value="",
			document.getElementById('bookmarkDescription').value=""
			document.getElementById('bookmarkLink').value=""
		})
		.then(listBookmarks());//Appel à listBookmarks permettant d'afficher le nouveau bookmark
}

function verifInputBookmark(titleInputId, linkInputId){
	//Titre:
	if(! document.getElementById(titleInputId).value) return false;

	//Link :
	if(! document.getElementById(linkInputId).value) return false;
	//Note: je ne vérifie pas la forme de l'url puisque cela peut être un lien interne


	//Note: pas besoin de faire des tests sur la descriptions ou les tags vu qu'ils sont optionnels.

	return true;
}

function clickBookmark(bookmark) {
	if(! bookmark.classList.contains('selected')){
		//Vérifie qu'un bookmark précédent était selected, alors on le "déselectionne" ...
		const previousSelected = document.getElementById('items')
			.querySelector('.selected');
		if(previousSelected){
			previousSelected.classList.remove('selected');

			//On n'oublie pas de le rafficher correctement
			previousSelected.removeChild(previousSelected.querySelector('form'));
			for(previousChild of previousSelected.children) previousChild.style.display='';
		}

		//... Pour sélectionner le nouveau
		bookmark.classList.add('selected');

		//On fait disparaître les éléments
		for(bookmarkChild of bookmark.children) bookmarkChild.style.display='none';

		/*Puis on crée le form et l'ajoute au bookmark correspondant*/
		bookmark.appendChild(createBookmarkForm(bookmark));
	}
}

function createBookmarkForm(bookmark){
	//On crée le form:
	const formModif = document.createElement('form');

	const fieldsetBalise = document.createElement('fieldset');
	formModif.appendChild(fieldsetBalise);

	//Zone de Titre
	const titleArea = createLabeldInput({'type':'text', 'value': bookmark.querySelector('h2').textContent}, 'titleText', 'Title');
	//Zone du lien
	const linkArea = createLabeldInput({'type':'text', 'value': bookmark.querySelector('a').getAttribute('href')}, 'linkText', 'Link');

	//Zone de la description
	const descriptionArea = document.createElement('textArea');
	descriptionArea.setAttribute('lig', '3');
	descriptionArea.setAttribute('col', '20');
	descriptionArea.setAttribute('id', 'descriptionArea');
	descriptionArea.textContent = bookmark.querySelector('.description').textContent;

	//Label pour la description
	const labelDescription = document.createElement('label');
	labelDescription.textContent = 'Description';
	labelDescription.setAttribute('for', 'descriptionArea');


	//Liste des tags
	const selectTags = document.createElement('select');
	selectTags.multiple = true;//Rend la sélection multiple possible
	selectTags.setAttribute('id', 'tagEditSelection');

	const alreadySelectedTags = [];
	bookmark.querySelector('.tags').childNodes
		.forEach(e=>alreadySelectedTags.push(e.textContent));
	//On remplie
	fetch(`${wsBase}tags`, {method:'GET', headers: {'x-access-token': token}})//Envoie la requete
		.then(res => res.json())//Parse le resultat en objet json
		.then(jsonObject => jsonObject['data'].forEach(e =>{//Ajoute le tag dans ceux sélectionnable pour la création d'un bookmark
				const tagOptionBalise = addSelectableTag(e, 'tagEditSelection');
				if(alreadySelectedTags.includes(e['name'])){
					tagOptionBalise.setAttribute('selected', 'true');
				}
			})
		);

	//Label des tags:
	const labelTags = document.createElement('label');
	labelTags.textContent = 'Tags  possibles';
	labelTags.setAttribute('for', 'tagEditSelection');


	//Edit bookmark button, récupère uniquemenent le "input" du array renvoyé
	const editBookmarkButton  = createLabeldInput({'type':'button', 'name': 'editBookmark', 'value': 'Modify Bookmark'}, '', '')[1];

	//Remove Bookmark button:
	const removeBookmarkButton  = createLabeldInput({'type':'button', 'name': 'removeBookmark', 'value': 'Remove Bookmark'}, '', '')[1];

	//Ajout les éléments au form
	const ulBalise = document.createElement('ul');
	createLiBalise(ulBalise, titleArea.concat(linkArea));//Concat permet la concaténation d'array
	createLiBalise(ulBalise, [labelDescription, descriptionArea]);
	createLiBalise(ulBalise, [labelTags, selectTags]);
	createLiBalise(ulBalise, [/*editBookmarkButton,*/ removeBookmarkButton]);

	fieldsetBalise.appendChild(ulBalise);

	//Ajout des événements
	titleArea[1].addEventListener('submit',(e)=>{e.preventDefault();});
	linkArea[1].addEventListener('submit',(e)=>{e.preventDefault();});
	editBookmarkButton.addEventListener('click', modifyBookmark);
	removeBookmarkButton.addEventListener('click', removeBookmark);

	return formModif;
}

function createLiBalise(ulBalise, liContent){
	const liBalise = document.createElement('li');

	liContent.forEach(e=>{liBalise.appendChild(e);});
	ulBalise.appendChild(liBalise);
}

function modifyBookmark() {
	//Vérifie que les données saisies sont valides
	const formEditBalise = document.getElementById('items').querySelector('.selected')
		.querySelector('form');
	if(! verifInputBookmark('titleText', 'linkText')){
		alert('Veuillez vérifier que vous ayez bien saisi un titre et un lien internet valide!');
		return ;
	}

	//Récupère les tags sélectionnés.
	const selectedTags = [];
	formEditBalise.querySelector('#tagEditSelection').childNodes.forEach(e=>{
		if(e.selected){
			selectedTags.push({'id': e.getAttribute('num'), 'name':e.textContent});
		}
	});

	//Crée l'objet JSON que l'on va envoyer
	const descriptionValue = formEditBalise.querySelector('#descriptionArea').value;
	const data = {
		'title': formEditBalise.querySelector('#titleText').value,
		'description': (descriptionValue)? descriptionValue: 'pas de description',
		'link':formEditBalise.querySelector('#linkText').value,
		'tags': selectedTags
	};

	modifyElem('bookmarks', listBookmarks, data);
}


/* Loads the list of all tags and displays them */
function listTags() {
	console.log('listTags called');
	listElem('tags', writeTags);
}

function writeTags(tagsJsonObject){
	//Clone le modèle
	const copieModel = document.querySelector('.model.tag').cloneNode(deep=true);//deep=true permet de copier les éléments fils

	//Modifie le name
	copieModel.querySelector('h2').textContent = tagsJsonObject['name'];

	//Modifie le div epour l'identifier
	copieModel.setAttribute('num', tagsJsonObject['id']);
	copieModel.classList.replace('model', 'item');

	//L'inscris dans le fichier
	document.getElementById('items').appendChild(copieModel);
}

/* Adds a new tag */
function addTag() {
	const textBox = document.querySelector('input[name="name"]');
	//Vérifie que le tag a bien un titre
	if(! textBox.value){
		alert('Il faut rentrer un nom pour créer un nouveau tag.');
		return ;
	}

	const newTag = {'name':textBox.value};

	//Requête api pour envoyer le nouveau tag au serveur
	fetch(`${wsBase}tags`, {method:'POST',
		headers:{'x-access-token': token, 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
		body: 'data=' + JSON.stringify(newTag)})//Envoie la requete
		.then(document.querySelector('input[name="name"]').value="")
		.then(listTags());//Appel à listTags permettant d'afficher le nouveau tag
}

/* Handles the click on a tag */
function clickTag(tag) {
	if(! tag.classList.contains('selected')){

		//Vérifie qu'un tag précédent était selected, alors on le "déselectionne" ...
		const previousSelected = document.getElementById('items')
			.querySelector('.selected');
		if(previousSelected){
			previousSelected.classList.remove('selected');

			//On n'oublie pas de le rafficher correctement
			previousSelected.removeChild(previousSelected.querySelector('form'));
			previousSelected.querySelector('h2').style.display='';
		}

		//... Pour sélectionner le nouveau
		tag.classList.add('selected');

		//On fait disparaître le tag
		const h2Balise = tag.querySelector('h2');
		h2Balise.style.display='none';

		/*Puis crée le form et l'ajoute au tag correspondant*/
		tag.appendChild(createTagForm(h2Balise));

	}
}

function createTagForm(h2Balise){
	//On crée le form:
	const formModif = document.createElement('form');

	const fieldsetBalise = document.createElement('fieldset');
	formModif.appendChild(fieldsetBalise);

	//Zone de saisie de caractères (récupère le 'input' de la textBox)
	const textBox  = createLabeldInput({'type':'text', 'name': 'nameText', 'value': h2Balise.textContent}, 'nameText', '')[1];

	//ModifyName button
	const modifyNameButton  = createLabeldInput({'type':'button', 'name': 'modifyName', 'value': 'Modify Name'}, '', '')[1];

	//Remove Tag button:
	const removeTagButton  = createLabeldInput({'type':'button', 'name': 'removeTag', 'value': 'Remove Tag'}, '', '')[1];

	//Ajout des éléments au form
	fieldsetBalise.appendChild(textBox);
	fieldsetBalise.appendChild(modifyNameButton);
	fieldsetBalise.appendChild(removeTagButton);

	//Ajout des événements
	textBox.addEventListener('submit',(e)=>{e.preventDefault();modifyTag();});
	modifyNameButton.addEventListener('click', modifyTag);
	removeTagButton.addEventListener('click', removeTag);

	return formModif;
}

/* Performs the modification of a tag */
function modifyTag() {
	const newName = document.getElementById('nameText').value;// Nouveau nom
	modifyElem('tags', listTags, {'name': newName});
}

/* Removes a tag */
function removeTag() {
	removeElem('tags', listTags);
}

function createLabeldInput(JsonInputAttributes, idInput, labelValue){
	const labeldInput = [];
	const inputBalise = document.createElement('input');
	const labelBalise = document.createElement('label');

	//On rajoute les attributs pour le input
	for(let key in JsonInputAttributes){
		inputBalise.setAttribute(key, JsonInputAttributes[key]);
	}

	//De même pour le label:
	labelBalise.textContent = labelValue;

	//Gère l'id si il y en a un
	if(idInput !== ''){
		inputBalise.setAttribute('id', idInput);
		labelBalise.setAttribute('for', idInput);
	}

	labeldInput.push(labelBalise);
	labeldInput.push(inputBalise);
	return labeldInput;
}

function listElem(type, writeFunction) {
	//Nettoie le div 'items'
	document.getElementById('items').innerHTML = '';

	//Récupère la liste des éléments en JSON:
	fetch(`${wsBase}${type}`, {method:'GET', headers: {'x-access-token': token}})//Envoie la requete
		.then(res => res.json())//Parse le resultat en objet json
		.then(jsonObject => { 
		if(jsonObject.data != null) jsonObject['data'].forEach(e => writeFunction(e));
		});//Représente tous les élements dans le fichier
}

function removeElem(type, listFunction){
	const elemToDelete = document.getElementById('items')
		.querySelector('.selected');

	const elemID = elemToDelete.getAttribute('num');
	fetch(`${wsBase}${type}/${elemID}`, {method:'DELETE', headers:{'x-access-token': token}})
		.then(listFunction());
}

function modifyElem(type, listFunction, data) {
	//Récupère l'élément à modifier
	const elemToModify = document.getElementById('items')
		.querySelector('.selected');

	const elemId = elemToModify.getAttribute('num'); // ID

	//Envoie une requête PUT pour modifier son nom
	fetch(`${wsBase}${type}/${elemId}`, {method:'PUT',
		headers:{'x-access-token': token, 'Content-Type':'application/x-www-form-urlencoded'},
		body: 'data=' + JSON.stringify(data)})
		.then(listFunction());//Affiche en appelant listTags/Bookmark
}

/* On document loading */
function miseEnPlace() {

	/* Give access token for future ajax requests */
	// Put the name of the current user into <h1>
	setIdentity();
	// Adapt the height of <div id="contents"> to the navigator window
	setContentHeight();
	window.addEventListener('resize',setContentHeight);
	// Listen to the clicks on menu items
	for (let element of document.querySelectorAll('#menu li')){
		element.addEventListener('click',function() {
			const isTags = this.classList.contains('tags');
			selectObjectType(isTags ? 'tags' : 'bookmarks');
		},false);
	}
	// Initialize the object type to "tags"
	selectObjectType('tags');
	// Listen to clicks on the "add tag" button

	document.getElementById('addTag').addEventListener('click',addTag,false);
	document.getElementById('addBookmark').addEventListener('click', addBookmark, false);
	document.getElementById('items').addEventListener('click',(e)=>{
			// Listen to clicks on the tag items
			const tag = e.target.closest('.tag.item');
			if (tag !== null) {clickTag(tag);return;}
			// Questions 10 & 12 - Listen to clicks on bookmark items
			const bookmark = e.target.closest('.bookmark.item');
			if (bookmark !== null) {clickBookmark(bookmark);}
		}
		,false);
}
window.addEventListener('load',miseEnPlace,false);


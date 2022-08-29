// write your code here
const form = document.querySelector('#new-ramen')
const baseUrl = 'http://localhost:3000'
const ramenMenu = document.querySelector('#ramen-menu')
const ramenDetail = document.querySelector('#ramen-detail')
const ratingDisplay = document.querySelector('#rating-display')
const commentDisplay = document.querySelector('#comment-display')
const editForm = document.querySelector('#edit-ramen')


//on page loads, get all images and display them in #ramen-menu
document.addEventListener('DOMContentLoaded',onPageLoad)
form.addEventListener('submit',submitHandler)
editForm.addEventListener('submit',editSubmitHandler)

//Event Handlers

async function onPageLoad(event){
    const images = await (await (get('/ramens'))).json()
    images.forEach(img => {
        const imageEle = createImage({
            src: img.image,
            alt: `${img.restaurant}-${img.name}`,
            'data-comment': img.comment,
            'data-rating':img.rating,
            'data-id':img.id
        })
        createImageCard(imageEle)
    })    
    const firstImage = document.querySelector('img')
    imageHandler({target: firstImage})


}
function imageHandler(event){
    const { target } = event
    const altTarget = target.getAttribute('alt')
    const [nameTarget, restaurantTarget ] = altTarget.split('-')
    const srcTarget = target.getAttribute('src')
    ramenDetail.querySelector('.name').textContent = nameTarget
    ramenDetail.querySelector('.restaurant').textContent = restaurantTarget
    ramenDetail.querySelector('img').setAttribute('src',srcTarget)
    ratingDisplay.textContent = target.getAttribute('data-rating')
    commentDisplay.textContent = target.getAttribute('data-comment')

    // repurposeFormToEdit({
    //     id: target.getAttribute('data-id'),
    //     name: nameTarget,
    //     restaurant: restaurantTarget,
    //     src: srcTarget,
    //     rating:target.getAttribute('data-rating'),
    //     comment: target.getAttribute('data-comment')
    // })
    
 
}

async function submitHandler(event){
    //add image to ramen-menu then post it to our server
    const {target} = event
    event.preventDefault()
    const nameInput = form['new-name'].value
    const restaurantInput = form['new-restaurant'].value
    const imageInput = form['new-image'].value
    const ratingInput = form['new-rating'].value
    const commentInput = form['new-comment'].value

    //persist the image.To get an assigned id
    const response = await post('/ramens',{
        name: nameInput,
        restaurant: restaurantInput,
        image:imageInput,
        rating:ratingInput,
        comment:commentInput
    })
    const data = await response.json() 

    //create an image
    const imageEle = createElement('img',{
            src: imageInput,
            alt: `${restaurantInput}-${nameInput}`,
            'data-comment': commentInput,
            'data-rating':ratingInput,
            'data-id':data.id

        })
    createImageCard(imageEle) 
    target.reset()   

}

//fetch functions

function get(path){
    const config  = {
        method: 'get',
        headers: {
            accept: 'application/json'
        }
    }
    
    return fetch(baseUrl+path)
}
function post(url, payload){
    const config  = {
        method: 'post',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    return fetch(baseUrl+url, config)

}
function put(url, payload){
    const config  = {
        method: 'put',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',            
        },
        body: JSON.stringify(payload)
    }
    return fetch(baseUrl+url, config)

}
function deleteStuff(url){
    const config  = {
        method: 'delete'             
    }
    return fetch(baseUrl+url, config)

}


//utilities fn
function createElement(tag, attributes = {}) {
    const element = document.createElement(tag);
    if (Object.keys(attributes).length > 0) {
      for (const attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
      }
      return element;
    }
    return element;
}

function editHandler(event){
    console.log('edit clicked')
    const { target } = event;    
    const imgEle = target.parentNode.previousSibling
    const rating = imgEle.getAttribute('data-rating')
    const comment = imgEle.getAttribute('data-comment')
    const [name,restaurant] = imgEle.getAttribute('alt').split('-')
    const id = imgEle.getAttribute('data-id')
    const h4 = editForm.querySelector('h4')
    editForm.classList.remove('hidden')
    editForm['new-rating'].value = rating
    editForm['new-comment'].value = comment
    editForm.querySelector('h4')
    h4.innerHTML = `Updating Featured Ramen: ${name} of restaurant:<span id="${id}">${restaurant}</span>`
    
}
async function editSubmitHandler(event){
    const {target} = event
    event.preventDefault()    
    const ratingInput = editForm['new-rating'].value
    const commentInput = editForm['new-comment'].value
    const id = editForm.querySelector('span').getAttribute('id')
    const img = document.querySelector(`img[data-id="${id}"]`)
    const [restaurant, name] = img.getAttribute('alt').split('-')
    
    //put
    try{

        const putResponse = await put(`/ramens/${id}`, {        
            id: id,
            name: name,
            restaurant: restaurant,
            image:  img.getAttribute('src'),
            rating: ratingInput,
            comment: commentInput
              
        })
        const data = await putResponse.json()
        img.setAttribute('data-rating',ratingInput)
        img.setAttribute('data-comment',commentInput)
        target.querySelector('h4').textContent = "Update the Featured Ramen"
        target.classList.add('hidden')
        target.reset()

    }catch(error){
        console.error(error)

    }

    
}


async function deleteHandler(event){
    const { target } = event
    const img = target.parentNode.previousSibling
    const id =  img.getAttribute('data-id')
    const resp = await deleteStuff(`/ramens/${id}`)
    const data = await resp.json()
    
    if(!Object.keys(data).length){
        img.parentNode.remove()

    }else{
        console.error(`something went wrong and i couldnt delete ${id}`)
    }
}

function createEventListener(tag,fnHandler,eventType='click'){
    tag.addEventListener(eventType,fnHandler)
}

function createImage(attributes){
    return createElement('img',attributes)
}
function createImageCard(imageEle){
    const divEditables = createElement('div',{class: 'editables'})
    const div = createElement('div')  
    const spanEdit = createElement('span')
    const  spanDelete= createElement('span')

    spanEdit.innerHTML = "&#x270E;"  
    spanDelete.innerHTML = "&#10007;"

    createEventListener(spanEdit,editHandler)
    createEventListener(spanDelete,deleteHandler) 

    divEditables.append(spanEdit, spanDelete)

    div.append(imageEle,divEditables)  

   ramenMenu.append(div) 
   createEventListener(imageEle,imageHandler)    

}
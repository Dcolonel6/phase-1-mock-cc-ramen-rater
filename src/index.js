// write your code here
const form = document.querySelector('#new-ramen')
const baseUrl = 'http://localhost:3000'
const ramenMenu = document.querySelector('#ramen-menu')
const ramenDetail = document.querySelector('#ramen-detail')
const ratingDisplay = document.querySelector('#rating-display')
const commentDisplay = document.querySelector('#comment-display')


//on page loads, get all images and display them in #ramen-menu
document.addEventListener('DOMContentLoaded',onPageLoad)
form.addEventListener('submit',submitHandler)










//Event Handlers

async function onPageLoad(event){
    const images = await (await (get('/ramens'))).json()
    images.forEach(img => {
        const imageEle = createElement('img',
        {
            src: img.image,
            alt: `${img.restaurant}-${img.name}`,
            'data-comment': img.comment,
            'data-rating':img.rating
        })
       ramenMenu.append(imageEle) 
       imageEle.addEventListener('click',imageHandler)
    })


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
    

}

async function submitHandler(event){
    //add image to ramen-menu then post it to our server
    event.preventDefault()
    const nameInput = form['new-name'].value
    const restaurantInput = form['new-restaurant'].value
    const imageInput = form['new-image'].value
    const ratingInput = form['new-rating'].value
    const commentInput = form['new-comment'].value

    //create an image
    const imageEle = createElement('img',{
            src: imageInput,
            alt: `${restaurantInput}-${nameInput}`,
            'data-comment': commentInput,
            'data-rating':ratingInput
        })
    ramenMenu.append(imageEle)
  

    target.reset()

    console.log(response)

}


//utilities fn

function get(path){
    const config  = {
        method: 'get',
        headers: {
            accept: 'application/json'
        }
    }
    
    return fetch(baseUrl+path)
}



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
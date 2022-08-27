// write your code here
const form = document.querySelector('#new-ramen')
const nameInput = form['new-name']
const restaurantInput = form['new-restaurant']
const imageInput = form['new-image']
const ratingInput = form['new-rating']
const commentInput = form['new-comment']
const baseUrl = 'http://localhost:3000'
const ramenMenu = document.querySelector('#ramen-menu')
const ramenDetail = document.querySelector('#ramen-detail')

//on page loads, get all images and display them in #ramen-menu
document.addEventListener('DOMContentLoaded',onPageLoad)











//Event Handlers

async function onPageLoad(event){
    const images = await (await (get('/ramens'))).json()
    images.forEach(img => {
        const imageEle = createElement('img',
        {
            src: img.image,
            alt: `${img.restaurant}-${img.name}`
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

function post(url, payload){
    const config  = {
        method: 'post',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

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